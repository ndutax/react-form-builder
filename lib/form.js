"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _fbemitter = require("fbemitter");
var _reactIntl = require("react-intl");
var _formValidator = _interopRequireDefault(require("./form-validator"));
var _formElements = _interopRequireDefault(require("./form-elements"));
var _multiColumn = require("./multi-column");
var _fieldset = require("./fieldset");
var _customElement = _interopRequireDefault(require("./form-elements/custom-element"));
var _registry = _interopRequireDefault(require("./stores/registry"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /* eslint-disable arrow-body-style */ /* eslint-disable camelcase */ /**
  * <Form />
  */
var Image = _formElements["default"].Image,
  Checkboxes = _formElements["default"].Checkboxes,
  Signature = _formElements["default"].Signature,
  Download = _formElements["default"].Download,
  Camera = _formElements["default"].Camera,
  FileUpload = _formElements["default"].FileUpload;
var ReactForm = /*#__PURE__*/function (_React$Component) {
  function ReactForm(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, ReactForm);
    _this = _callSuper(this, ReactForm, [props]);
    (0, _defineProperty2["default"])(_this, "form", void 0);
    (0, _defineProperty2["default"])(_this, "inputs", {});
    (0, _defineProperty2["default"])(_this, "answerData", void 0);
    (0, _defineProperty2["default"])(_this, "_getOptionKeyValue", function (option) {
      return _this.props.option_key_value === 'value' ? option.value : option.key;
    });
    (0, _defineProperty2["default"])(_this, "handleRenderSubmit", function () {
      var name = _this.props.action_name || _this.props.actionName;
      var actionName = name || 'Submit';
      var _this$props$submitBut = _this.props.submitButton,
        submitButton = _this$props$submitBut === void 0 ? false : _this$props$submitBut;
      return submitButton || /*#__PURE__*/_react["default"].createElement("input", {
        type: "submit",
        className: "btn btn-big",
        value: actionName
      });
    });
    (0, _defineProperty2["default"])(_this, "handleRenderBack", function () {
      var name = _this.props.back_name || _this.props.backName;
      var backName = name || 'Cancel';
      var _this$props$backButto = _this.props.backButton,
        backButton = _this$props$backButto === void 0 ? false : _this$props$backButto;
      return backButton || /*#__PURE__*/_react["default"].createElement("a", {
        href: _this.props.back_action,
        className: "btn btn-default btn-cancel btn-big"
      }, backName);
    });
    _this.answerData = _this._convert(props.answer_data);
    _this.emitter = new _fbemitter.EventEmitter();
    _this.getDataById = _this.getDataById.bind(_this);

    // Bind handleBlur and handleChange methods
    _this.handleBlur = _this.handleBlur.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }
  (0, _inherits2["default"])(ReactForm, _React$Component);
  return (0, _createClass2["default"])(ReactForm, [{
    key: "_convert",
    value: function _convert(answers) {
      if (Array.isArray(answers)) {
        var result = {};
        answers.forEach(function (x) {
          if (x.name.indexOf('tags_') > -1) {
            result[x.name] = x.value.map(function (y) {
              return y.value;
            });
          } else {
            result[x.name] = x.value;
          }
        });
        return result;
      }
      return answers || {};
    }
  }, {
    key: "_getDefaultValue",
    value: function _getDefaultValue(item) {
      return this.answerData[item.field_name];
    }
  }, {
    key: "_optionsDefaultValue",
    value: function _optionsDefaultValue(item) {
      var _this2 = this;
      var defaultValue = this._getDefaultValue(item);
      if (defaultValue) {
        return defaultValue;
      }
      var defaultChecked = [];
      item.options.forEach(function (option) {
        if (_this2.answerData["option_".concat(option.key)]) {
          defaultChecked.push(option.key);
        }
      });
      return defaultChecked;
    }
  }, {
    key: "_getItemValue",
    value: function _getItemValue(item, ref, trimValue) {
      var $item = {
        element: item.element,
        value: ''
      };
      if (item.element === 'Rating') {
        $item.value = ref.inputField.current.state.rating;
      } else if (item.element === 'Tags') {
        $item.value = ref.inputField.current.state.value;
      } else if (item.element === 'DatePicker') {
        $item.value = ref.state.value;
      } else if (item.element === 'Camera') {
        $item.value = ref.state.img;
      } else if (item.element === 'FileUpload') {
        $item.value = ref.state.fileUpload;
      } else if (ref && ref.inputField && ref.inputField.current) {
        $item = ref.inputField.current;
        if (trimValue && $item && typeof $item.value === 'string') {
          $item.value = $item.value.trim();
        }
      }
      return $item;
    }
  }, {
    key: "_isIncorrect",
    value: function _isIncorrect(item) {
      var incorrect = false;
      if (item.canHaveAnswer) {
        var ref = this.inputs[item.field_name];
        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          item.options.forEach(function (option) {
            var $option = ref.options["child_ref_".concat(option.key)];
            if (option.hasOwnProperty('correct') && !$option.checked || !option.hasOwnProperty('correct') && $option.checked) {
              incorrect = true;
            }
          });
        } else {
          var $item = this._getItemValue(item, ref);
          if (item.element === 'Rating') {
            if ($item.value.toString() !== item.correct) {
              incorrect = true;
            }
          } else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
            incorrect = true;
          }
        }
      }
      return incorrect;
    }
  }, {
    key: "_isInvalid",
    value: function _isInvalid(item) {
      var invalid = false;
      if (item.required === true) {
        var ref = this.inputs[item.field_name];
        if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
          var checked_options = 0;
          item.options.forEach(function (option) {
            var $option = ref.options["child_ref_".concat(option.key)];
            if ($option.checked) {
              checked_options += 1;
            }
          });
          if (checked_options < 1) {
            // errors.push(item.label + ' is required!');
            invalid = true;
          }
        } else {
          var $item = this._getItemValue(item, ref);
          if (item.element === 'Rating') {
            if ($item.value === 0) {
              invalid = true;
            }
          } else if ($item.value === undefined || $item.value.length < 1) {
            invalid = true;
          }
        }
      }
      return invalid;
    }
  }, {
    key: "_collect",
    value: function _collect(item, trimValue) {
      var _this3 = this;
      var itemData = {
        id: item.id,
        name: item.field_name,
        custom_name: item.custom_name || item.field_name
      };
      if (!itemData.name) return null;
      var ref = this.inputs[item.field_name];
      if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
        var checked_options = [];
        item.options.forEach(function (option) {
          var $option = ref.options["child_ref_".concat(option.key)];
          if ($option.checked) {
            checked_options.push(_this3._getOptionKeyValue(option));
          }
        });
        itemData.value = checked_options;
      } else {
        if (!ref) return null;
        itemData.value = this._getItemValue(item, ref, trimValue).value;
      }
      return itemData;
    }
  }, {
    key: "_collectFormData",
    value: function _collectFormData(data, trimValue) {
      var _this4 = this;
      var formData = [];
      data.forEach(function (item) {
        var item_data = _this4._collect(item, trimValue);
        if (item_data) {
          formData.push(item_data);
        }
      });
      return formData;
    }
  }, {
    key: "_getSignatureImg",
    value: function _getSignatureImg(item) {
      var ref = this.inputs[item.field_name];
      var $canvas_sig = ref.canvas.current;
      if ($canvas_sig) {
        var base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
        var isEmpty = $canvas_sig.isEmpty();
        var $input_sig = ref.inputField.current;
        if (isEmpty) {
          $input_sig.value = '';
        } else {
          $input_sig.value = base64;
        }
      }
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(e) {
      e.preventDefault();
      var errors = [];
      if (!this.props.skip_validations) {
        errors = this.validateForm();
        // Publish errors, if any.
        this.emitter.emit('formValidation', errors);
      }

      // Only submit if there are no errors.
      if (errors.length < 1) {
        var onSubmit = this.props.onSubmit;
        if (onSubmit) {
          var data = this._collectFormData(this.props.data, true);
          onSubmit(data);
        } else {
          var $form = this.form;
          $form.submit();
        }
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      // Call submit function on blur
      if (this.props.onBlur) {
        var onBlur = this.props.onBlur;
        var data = this._collectFormData(this.props.data, true);
        onBlur(data);
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange() {
      // Call submit function on change
      if (this.props.onChange) {
        var onChange = this.props.onChange;
        var data = this._collectFormData(this.props.data, false);
        onChange(data);
      }
    }
  }, {
    key: "validateForm",
    value: function validateForm() {
      var _this5 = this;
      var errors = [];
      var data_items = this.props.data;
      var intl = this.props.intl;
      if (this.props.display_short) {
        data_items = this.props.data.filter(function (i) {
          return i.alternateForm === true;
        });
      }
      data_items.forEach(function (item) {
        if (item.element === 'Signature') {
          _this5._getSignatureImg(item);
        }
        if (_this5._isInvalid(item)) {
          errors.push("".concat(item.label, " ").concat(intl.formatMessage({
            id: 'message.is-required'
          }), "!"));
        }
        if (item.element === 'EmailInput') {
          var ref = _this5.inputs[item.field_name];
          var emailValue = _this5._getItemValue(item, ref).value;
          if (emailValue) {
            var validateEmail = function validateEmail(email) {
              return email.match(
              // eslint-disable-next-line no-useless-escape
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            };
            var checkEmail = validateEmail(emailValue);
            if (!checkEmail) {
              errors.push("".concat(item.label, " ").concat(intl.formatMessage({
                id: 'message.invalid-email'
              })));
            }
          }
        }
        if (item.element === 'PhoneNumber') {
          var _ref = _this5.inputs[item.field_name];
          var phoneValue = _this5._getItemValue(item, _ref).value;
          if (phoneValue) {
            var validatePhone = function validatePhone(phone) {
              return phone.match(
              // eslint-disable-next-line no-useless-escape
              /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g);
            };
            var checkPhone = validatePhone(phoneValue);
            if (!checkPhone) {
              errors.push("".concat(item.label, " ").concat(intl.formatMessage({
                id: 'message.invalid-phone-number'
              })));
            }
          }
        }
        if (_this5.props.validateForCorrectness && _this5._isIncorrect(item)) {
          errors.push("".concat(item.label, " ").concat(intl.formatMessage({
            id: 'message.was-answered-incorrectly'
          }), "!"));
        }
      });
      return errors;
    }
  }, {
    key: "getDataById",
    value: function getDataById(id) {
      var data = this.props.data;
      return data.find(function (x) {
        return x.id === id;
      });
    }
  }, {
    key: "getInputElement",
    value: function getInputElement(item) {
      var _this6 = this;
      if (item.custom) {
        return this.getCustomElement(item);
      }
      var Input = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Input, {
        handleChange: this.handleChange,
        ref: function ref(c) {
          return _this6.inputs[item.field_name] = c;
        },
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        read_only: this.props.read_only,
        defaultValue: this._getDefaultValue(item)
      });
    }
  }, {
    key: "getContainerElement",
    value: function getContainerElement(item, Element) {
      var _this7 = this;
      var controls = item.childItems.map(function (x) {
        return x ? _this7.getInputElement(_this7.getDataById(x)) : /*#__PURE__*/_react["default"].createElement("div", null, "\xA0");
      });
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item,
        controls: controls
      });
    }
  }, {
    key: "getSimpleElement",
    value: function getSimpleElement(item) {
      var Element = _formElements["default"][item.element];
      return /*#__PURE__*/_react["default"].createElement(Element, {
        mutable: true,
        key: "form_".concat(item.id),
        data: item
      });
    }
  }, {
    key: "getCustomElement",
    value: function getCustomElement(item) {
      var _this8 = this;
      var intl = this.props.intl;
      if (!item.component || typeof item.component !== 'function') {
        item.component = _registry["default"].get(item.key);
        if (!item.component) {
          console.error("".concat(item.element, " ").concat(intl.formatMessage({
            id: 'message.was-not-registered'
          })));
        }
      }
      var inputProps = item.forwardRef && {
        handleChange: this.handleChange,
        defaultValue: this._getDefaultValue(item),
        ref: function ref(c) {
          return _this8.inputs[item.field_name] = c;
        }
      };
      return /*#__PURE__*/_react["default"].createElement(_customElement["default"], (0, _extends2["default"])({
        mutable: true,
        read_only: this.props.read_only,
        key: "form_".concat(item.id),
        data: item
      }, inputProps));
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;
      var data_items = this.props.data;
      if (this.props.display_short) {
        data_items = this.props.data.filter(function (i) {
          return i.alternateForm === true;
        });
      }
      data_items.forEach(function (item) {
        if (item && item.readOnly && item.variableKey && _this9.props.variables[item.variableKey]) {
          _this9.answerData[item.field_name] = _this9.props.variables[item.variableKey];
        }
      });
      var items = data_items.filter(function (x) {
        return !x.parentId;
      }).map(function (item) {
        if (!item) return null;
        switch (item.element) {
          case 'TextInput':
          case 'EmailInput':
          case 'PhoneNumber':
          case 'NumberInput':
          case 'TextArea':
          case 'Dropdown':
          case 'DatePicker':
          case 'RadioButtons':
          case 'Rating':
          case 'Tags':
          case 'Range':
            return _this9.getInputElement(item);
          case 'CustomElement':
            return _this9.getCustomElement(item);
          case 'MultiColumnRow':
            return _this9.getContainerElement(item, _multiColumn.MultiColumnRow);
          case 'ThreeColumnRow':
            return _this9.getContainerElement(item, _multiColumn.ThreeColumnRow);
          case 'TwoColumnRow':
            return _this9.getContainerElement(item, _multiColumn.TwoColumnRow);
          case 'FieldSet':
            return _this9.getContainerElement(item, _fieldset.FieldSet);
          case 'Signature':
            return /*#__PURE__*/_react["default"].createElement(Signature, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item)
            });
          case 'Checkboxes':
            return /*#__PURE__*/_react["default"].createElement(Checkboxes, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only,
              handleChange: _this9.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._optionsDefaultValue(item)
            });
          case 'Image':
            return /*#__PURE__*/_react["default"].createElement(Image, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              handleChange: _this9.handleChange,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item)
            });
          case 'Download':
            return /*#__PURE__*/_react["default"].createElement(Download, {
              download_path: _this9.props.download_path,
              mutable: true,
              key: "form_".concat(item.id),
              data: item
            });
          case 'Camera':
            return /*#__PURE__*/_react["default"].createElement(Camera, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item)
            });
          case 'FileUpload':
            return /*#__PURE__*/_react["default"].createElement(FileUpload, {
              ref: function ref(c) {
                return _this9.inputs[item.field_name] = c;
              },
              read_only: _this9.props.read_only || item.readOnly,
              mutable: true,
              key: "form_".concat(item.id),
              data: item,
              defaultValue: _this9._getDefaultValue(item)
            });
          default:
            return _this9.getSimpleElement(item);
        }
      });
      var formTokenStyle = {
        display: 'none'
      };
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_formValidator["default"], {
        emitter: this.emitter
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "react-form-builder-form"
      }, /*#__PURE__*/_react["default"].createElement("form", {
        encType: "multipart/form-data",
        ref: function ref(c) {
          return _this9.form = c;
        },
        action: this.props.form_action,
        onBlur: this.handleBlur,
        onChange: this.handleChange,
        onSubmit: this.handleSubmit,
        method: this.props.form_method
      }, this.props.authenticity_token && /*#__PURE__*/_react["default"].createElement("div", {
        style: formTokenStyle
      }, /*#__PURE__*/_react["default"].createElement("input", {
        name: "utf8",
        type: "hidden",
        value: "\u2713"
      }), /*#__PURE__*/_react["default"].createElement("input", {
        name: "authenticity_token",
        type: "hidden",
        value: this.props.authenticity_token
      }), /*#__PURE__*/_react["default"].createElement("input", {
        name: "task_id",
        type: "hidden",
        value: this.props.task_id
      })), items, /*#__PURE__*/_react["default"].createElement("div", {
        className: "btn-toolbar"
      }, !this.props.hide_actions && this.handleRenderSubmit(), !this.props.hide_actions && this.props.back_action && this.handleRenderBack()))));
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = (0, _reactIntl.injectIntl)(ReactForm);
ReactForm.defaultProps = {
  validateForCorrectness: false
};