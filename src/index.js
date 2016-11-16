let _ = require("lodash")
let vile = require("@forthright/vile")

const brakeman_cli = "brakeman"
const brakeman_base_options = ["-q", "--format", "json", "."]
const brakeman_type = {
  WARNING: 1,
  ERROR: 2
}
const no_br_issues = {
  warnings: [],
  errors: [],
  ignored_warnings: []
}

let brakeman_cli_args = (custom_config_path) =>
  (custom_config_path ?  ["-c", custom_config_path] : [])
    .concat(brakeman_base_options)

let brakeman = (custom_config_path) =>
  vile
    .spawn(brakeman_cli, {
      args: brakeman_cli_args(custom_config_path)
    })
    .then((data) => {
      let stdout = _.get(data, "stdout")
      return stdout ? JSON.parse(stdout) : no_br_issues
    })

let where = (br_issue) =>
  br_issue.line ?
    { start: { line: br_issue.line } } : {}

let message = (br_issue) => {
  let confidence = br_issue.confidence ?
    ` (Confidence: ${br_issue.confidence})` : ""
  return _.trim(br_issue.message ?
    (br_issue.message + confidence)
      : br_issue.error)
}

let filepath = (br_issue) => br_issue.file || ""

let link = (br_issue) => br_issue.link

let context = (br_type) =>
  br_type == brakeman_type.ERROR ?
    vile.ERR : vile.SEC

let signature = (br_issue) =>
  "brakeman::" +
    (br_issue.fingerprint || br_issue.error)

let title = (br_issue, type) =>
  type == brakeman_type.ERROR ?
    "Error" : br_issue.warning_type

// TODO: cleanly merge security object if type is that
let vile_issue = (br_issue, type) =>
  vile.issue({
    type: context(type),
    title: title(br_issue, type),
    signature: signature(br_issue),
    path: filepath(br_issue),
    message: message(br_issue),
    where: where(br_issue),
    security: {
      advisory: link(br_issue)
    }
  })

let into_issues = (brakeman_json) =>
  brakeman_json.warnings
    .map((warning) => vile_issue(warning, brakeman_type.WARNING))
    .concat(brakeman_json.errors
      .map((error) => vile_issue(error, brakeman_type.ERROR)))

// TODO: support other options like --skip-files
let punish = (plugin_config) =>
  brakeman(_.get(plugin_config, "config"))
    .then(into_issues)

module.exports = {
  punish: punish
}
