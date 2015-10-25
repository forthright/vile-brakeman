Promise = require "bluebird"

all_files = [
  {
    file: "app/models/some_other_model.rb",
    msg: "",
    type: "ok",
    where: { end: {}, start: {} }
  }
  {
    file: "app/models/a_model.rb",
    msg: "",
    type: "ok",
    where: { end: {}, start: {} }
  }
  {
    file: "config/routes.rb",
    msg: "",
    type: "ok",
    where: { end: {}, start: {} }
  }
  {
    file: "app/controllers/some_controller.rb",
    msg: "",
    type: "ok",
    where: { end: {}, start: {} }
  }
]

issues = [
  {
    file: "app/models/some_other_model.rb",
    msg: "",
    type: "ok",
    where: { end: {}, start: {} }
  }
  {
    file: "app/controllers/some_controller.rb",
    msg: "",
    type: "ok",
    where: { end: {}, start: {} }
  }
  {
    file: "app/models/a_model.rb",
    msg: "Potentially dangerous attribute available for " +
         "mass assignment (Mass Assignment) (Confidence: Weak)",
    type: "warn"
    where: {
      end: { }
      start: { }
    }
  }
  {
    file: "config/routes.rb",
    msg: "All public methods in controllers are available " +
         "as actions in routes.rb (Default Routes) (Confidence: High)",
    type: "warn",
    where: {
      end: { }
      start: { line: 34 }
    }
  }
  {
    file: "",
    msg: "(app/controllers/some_controller.rb:7 " +
         ":: parse error on value \"-\" (tOP_ASGN))",
    type: "error",
    where: { end: {}, start: {} }
  }
]

brakeman_json =
  {
    warnings: [
      {
        warning_type: "Mass Assignment"
        warning_code: 60
        fingerprint: "..."
        message: "Potentially dangerous attribute available for mass assignment"
        file: "app/models/a_model.rb"
        line: null
        link: "http://brakemanscanner.org/docs/warning_types/mass_assignment/"
        code: ":some_attr"
        render_path: null
        location: {
          type: "model"
          model: "AModel"
        }
        user_input: null
        confidence: "Weak"
      }
      {
        warning_type: "Default Routes"
        warning_code: 11
        fingerprint: ".."
        message: "All public methods in controllers are " +
                 "available as actions in routes.rb"
        file: "config/routes.rb"
        line: 34
        link: "http://brakemanscanner.org/docs/warning_types/default_routes/"
        code: null
        render_path: null
        location: null
        user_input: null
        confidence: "High"
      }
    ]
    ignored_warnings: [ ],
    errors: [{
      "error": "app/controllers/some_controller.rb:7 " +
               ":: parse error on value \"-\" (tOP_ASGN)",
      "location": "Could not parse app/controllers/some_controller.rb"
    }],
    scan_info: {
      app_path: "/some_path",
      rails_version: "4.2.1",
      security_warnings: 2,
      start_time: "2015-09-06 20:52:16 -0400",
      end_time: "2015-09-06 20:52:20 -0400",
      duration: 2,
      checks_performed: [ "...", ],
      number_of_controllers: 1,
      number_of_models: 2,
      number_of_templates: 0,
      ruby_version: "2.2.2",
      brakeman_version: "3.0.5"
    }
  }

setup = (vile) ->
  vile.promise_each.returns new Promise (resolve) ->
    resolve all_files

  vile.spawn.returns new Promise (resolve) ->
    resolve JSON.stringify brakeman_json

module.exports =
  issues: issues
  all_files: all_files
  setup: setup
