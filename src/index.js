let _ = require("lodash")
let vile = require("@brentlintner/vile")
let ignore = require("ignore-file")

const brakeman_cli = "brakeman"
const brakeman_base_options = ["-q", "--format", "json", "."]
const brakeman_type = {
  WARNING: 1,
  ERROR: 2
}

let is_ruby_file = (file) => !!file.match(/\.rb$/)

let allowed = (ignore_list) => {
  let ignored = ignore.compile(ignore_list.join("\n"))
  return (file) => is_ruby_file(file) && !ignored(file)
}

let brakeman_cli_args = (custom_config_path) =>
  (custom_config_path ?  ["-c", custom_config_path] : [])
    .concat(brakeman_base_options)

let brakeman = (custom_config_path) =>
  vile
    .spawn(brakeman_cli, {
      args: brakeman_cli_args(custom_config_path)
    })
    .then((stdout) =>
      stdout ? JSON.parse(stdout) :
      { warnings: [], errors: [], ignored_warnings: [] })

let vile_issue = (br_issue, type) => {
  let message = br_issue.message ? `${br_issue.message} ` : ""
  let warning_type = `(${br_issue.warning_type || br_issue.error}) `
  let confidence = br_issue.confidence ?
    `(Confidence: ${br_issue.confidence})` : ""

  return vile.issue(
    type == brakeman_type.WARNING ? vile.WARNING : vile.ERROR,
    br_issue.file || "",
    _.trim(message + warning_type + confidence),
    br_issue.line ? { line: br_issue.line } : undefined
  )
}

let into_issues = (brakeman_json) =>
  brakeman_json.warnings
    .map((warning) => vile_issue(warning, brakeman_type.WARNING))
  .concat(
    brakeman_json.errors
    .map((error) => vile_issue(error, brakeman_type.ERROR))
  )

let append_ok_issues = (all_files, issues) =>
  _.reject(all_files, (f) =>
    _.any(issues, (issue) => issue.file == f.file)
  ).concat(issues)

// TODO: support other options like --skip-files
let punish = (plugin_config) =>
  vile.promise_each(
    process.cwd(),
    allowed(_.get(plugin_config, "ignore", [])),
    (filepath) => vile.issue(vile.OK, filepath),
    { read_data: false }
  )
  .then((all_files) =>
    brakeman(_.get(plugin_config, "config"))
      .then(into_issues)
      .then(_.partial(append_ok_issues, all_files))
  )

module.exports = {
  punish: punish
}
