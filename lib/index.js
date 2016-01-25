"use strict";

var _ = require("lodash");
var vile = require("@brentlintner/vile");

var brakeman_cli = "brakeman";
var brakeman_base_options = ["-q", "--format", "json", "."];
var brakeman_type = {
  WARNING: 1,
  ERROR: 2
};
var no_br_issues = {
  warnings: [],
  errors: [],
  ignored_warnings: []
};

var brakeman_cli_args = function brakeman_cli_args(custom_config_path) {
  return (custom_config_path ? ["-c", custom_config_path] : []).concat(brakeman_base_options);
};

var brakeman = function brakeman(custom_config_path) {
  return vile.spawn(brakeman_cli, {
    args: brakeman_cli_args(custom_config_path)
  }).then(function (stdout) {
    return stdout ? JSON.parse(stdout) : no_br_issues;
  });
};

var where = function where(br_issue) {
  return br_issue.line ? { start: { line: br_issue.line } } : {};
};

var message = function message(br_issue) {
  var confidence = br_issue.confidence ? " (Confidence: " + br_issue.confidence + ")" : "";
  return _.trim(br_issue.message ? br_issue.message + confidence : br_issue.error);
};

var filepath = function filepath(br_issue) {
  return br_issue.file || "";
};

var link = function link(br_issue) {
  return br_issue.link;
};

var context = function context(br_type) {
  return br_type == brakeman_type.ERROR ? vile.ERR : vile.SEC;
};

var signature = function signature(br_issue) {
  return "brakeman::" + (br_issue.fingerprint || br_issue.error);
};

var title = function title(br_issue, type) {
  return type == brakeman_type.ERROR ? "Error" : br_issue.warning_type;
};

// TODO: cleanly merge security object if type is that
var vile_issue = function vile_issue(br_issue, type) {
  return vile.issue({
    type: context(type),
    title: title(br_issue, type),
    signature: signature(br_issue),
    path: filepath(br_issue),
    message: message(br_issue),
    where: where(br_issue),
    security: {
      advisory: link(br_issue)
    }
  });
};

var into_issues = function into_issues(brakeman_json) {
  return brakeman_json.warnings.map(function (warning) {
    return vile_issue(warning, brakeman_type.WARNING);
  }).concat(brakeman_json.errors.map(function (error) {
    return vile_issue(error, brakeman_type.ERROR);
  }));
};

// TODO: support other options like --skip-files
var punish = function punish(plugin_config) {
  return brakeman(_.get(plugin_config, "config")).then(into_issues);
};

module.exports = {
  punish: punish
};