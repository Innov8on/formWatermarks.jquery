/** Puts labels inside form's input fields.
* Requires jQuery 1.4
*
* Example usage:
*  jQuery('input').formWatermarks();
**/
jQuery.fn.formWatermarks = function() {


 /** Copy attributes from other element
  * @param other (jQuery collection or String) - element to copy attributes from
  * @param copyEvents (boolean) - Should we copy events *
  * @param omit (string) - attribute to be omited
  * Example usage:
  * copyAttributesFrom.call(jQuery('a.target', jQuery('a.source'));
  **/
  var copyAttributesFrom = function(other, copyEvents, omit) {
    this.each(function() {
      var this$ = jQuery(this);
      var other$ = jQuery(other);
      for (i = 0; i < other$[0].attributes.length; i++) {
        if (other$[0].attributes[i].specified) {
          var name = other$[0].attributes[i].nodeName.toString().toLowerCase();
          var value = other$[0].attributes[i].nodeValue.toString();
          if (typeof copyEvents === 'undefined' || !copyEvents || !name.match(/^on[a-z]+/)) {
            if (typeof omit === 'undefined' || !name.match(omit)) {
              this$[0][name] = value;
            }
          }
        }
      }
    });
  };


  /** Copy events from other element
    * @param other - element to copy events from
    * Example usage:
    * copyEventsFrom.call(jQuery('a.target'), jQuery('a.source'));
    **/
  var copyEventsFrom = function(other) {
    var other$ = jQuery(other);
    return this.each(function() {
      var this$ = jQuery(this);
      var events = other$.data('events');
      var e;
      if (events) {
        for (e in events) {
          if (events.hasOwnProperty(e) && typeof events[e] !== 'function') {
            for (i=0; i < events[e].length; i++) {
              this$.bind(e ,events[e][i].handler);
            }
          }
        }
      }
      for (i = 0; i < other$[0].attributes.length; i++) {
        if (other$[0].attributes[i].specified) {
          var onEvent = other$[0].attributes[i].nodeName.toString().toLowerCase();
          if (onEvent.match(/^on[a-z]+/)) {
            var func = other$[0].attributes[i].nodeValue.toString();
            this$[0][onEvent] = function() { eval(func); };
          }
        }
      }
    });
  };


  /** Changes type attribute of node (input field)
   *
   * @param newType (String) - New type to set ('password' || 'text')
   * @param makeActive (Boolean) - Do we want new element to be focused after change
   */
  var changeType = function(newType, makeActive) {
    var this$ = jQuery(this);
    try {
      this$.attr('type', newType);
      return this$;
    } catch(e) {
      var newElement = jQuery('<' + this$[0].tagName + '>', {type: newType});
      copyAttributesFrom.call(newElement, this$, false, /type/);
      copyEventsFrom.call(newElement, this$);
      newElement.data('_fw_label_text', this$.data('_fw_label_text'));
      newElement.data('_fw_password', this$.data('_fw_password'));
      this$.replaceWith(newElement);
      if (makeActive) {
        newElement.focus();
        newElement.focus();
      }
      return newElement;
    }
  };


  /* For blur event..
   */
  var blur = function() {
    var this$ = jQuery(this);
    if (!this$.attr('value') || this$.attr('value') === this$.data('_fw_label_text')) {
      this$.data('_fw_is_empty', true);
      if (this$.data('_fw_password')) {
        this$ = changeType.call(this$, 'text');
      }
      this$.addClass('empty');
      this$.attr('value',this$.data('_fw_label_text'));
    }
  };


  /* For focus event...
   */
  var focus = function() {
    this$ = jQuery(this);
    if (this$.attr('value') === this$.data('_fw_label_text')) {
      this$.data('_fw_is_empty', true);
    }
    if (this$.data('_fw_is_empty')) {
      this$.attr('value','');
      this$.data('_fw_is_empty', false);
      if (this$.data('_fw_password')) {
        try {
          this$ = changeType.call(this$[0], 'password', true);
        } catch (e) {}
      }
      this$.removeClass('empty');
    }
  };


  return this.each(function() {
    var this$ = jQuery(this);
    if (this.tagName.toLowerCase() !== 'input' || !this$.attr('type').match(/password|text/)) {
      return this$;
    }
    this$.data('_fw_password', (this$.attr('type') === 'password'));
    this$.data('_fw_label_text', jQuery('label[for="' + this$.attr('id') + '"]').hide().html());
    if (this$.data('_fw_label_text')) {
      this$.blur(blur);
      this$.focus(focus);
      blur.call(this$);
    }
    return this$;
  });
};
