"use strict";

var _ = require("lodash");
var vile = require("@brentlintner/vile");
var ignore = require("ignore-file");

var brakeman_cli = "brakeman";
var brakeman_base_options = ["-q", "--format", "json", "."];
var brakeman_type = {
  WARNING: 1,
  ERROR: 2
};

var is_ruby_file = function is_ruby_file(file) {
  return !!file.match(/\.rb$/);
};

var allowed = function allowed(ignore_list) {
  var ignored = ignore.compile(ignore_list.join("\n"));
  return function (file) {
    return is_ruby_file(file) && !ignored(file);
  };
};

var brakeman_cli_args = function brakeman_cli_args(custom_config_path) {
  return (custom_config_path ? ["-c", custom_config_path] : []).concat(brakeman_base_options);
};

var brakeman = function brakeman(custom_config_path) {
  return vile.spawn(brakeman_cli, {
    args: brakeman_cli_args(custom_config_path)
  }).then(function (stdout) {
    return stdout ? JSON.parse(stdout) : { warnings: [], errors: [], ignored_warnings: [] };
  });
};

var vile_issue = function vile_issue(br_issue, type) {
  var message = br_issue.message ? br_issue.message + " " : "";
  var warning_type = "(" + (br_issue.warning_type || br_issue.error) + ") ";
  var confidence = br_issue.confidence ? "(Confidence: " + br_issue.confidence + ")" : "";

  return vile.issue(type == brakeman_type.WARNING ? vile.WARNING : vile.ERROR, br_issue.file || "", _.trim(message + warning_type + confidence), br_issue.line ? { line: br_issue.line } : undefined);
};

var into_issues = function into_issues(brakeman_json) {
  return brakeman_json.warnings.map(function (warning) {
    return vile_issue(warning, brakeman_type.WARNING);
  }).concat(brakeman_json.errors.map(function (error) {
    return vile_issue(error, brakeman_type.ERROR);
  }));
};

var append_ok_issues = function append_ok_issues(all_files, issues) {
  return _.reject(all_files, function (f) {
    return _.any(issues, function (issue) {
      return issue.file == f.file;
    });
  }).concat(issues);
};

// TODO: support other options like --skip-files
var punish = function punish(plugin_config) {
  return vile.promise_each(process.cwd(), allowed(_.get(plugin_config, "ignore", [])), function (filepath) {
    return vile.issue(vile.OK, filepath);
  }, { read_data: false }).then(function (all_files) {
    return brakeman(_.get(plugin_config, "config")).then(into_issues).then(_.partial(append_ok_issues, all_files));
  });
};

module.exports = {
  punish: punish
};