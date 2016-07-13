/**
 * SequenceD-Views Module extension.
 *
 * Definition of Backbone Views required for Sequence Diagrams.
 */
var SequenceD = (function (sequenced) {

    var views = sequenced.Views = sequenced.Views || {};

    var BaseView = Backbone.View.extend(
    /** @lends BaseView.prototype */
    {
        /**
         * @augments Backbone.View
         * @constructs
         * @class BaseView Represents the base view for components in Sequence Diagrams.
         */
        initialize: function() {},

        /**
         * Default drag move handler which will translate view by appending new offsets
         * to current translate element.
         * @param {d3.event} event D3 event object.
         */
        dragMove: function (event) {
            var d = this.attribute("dragData");
            d.x += this.horizontalDrag() ? event.dx : 0;
            d.y += this.verticalDrag() ? event.dy : 0;
            this.el.attr("transform", function(){
                return "translate(" + [ d.x, d.y ] + ")"
            })
        },

        /**
         * Default drag start handler which captures original position
         * of the view.
         * @param {d3.event} event D3 event object.
         */
        dragStart: function (event) {
            if(this.attribute("dragData") === undefined){
                this.attribute("dragData", {x: this.horizontalDrag() ? event.dx : 0,
                                            y: this.verticalDrag() ? event.dy :0});
            }
        },

        /**
         * Default empty drag stop handler. Extending views need to override
         * for custom behaviour.
         */
        dragStop: function () {
        },

        /**
         * Sets, un-sets or gets an attribute of underline model. If a value is not passed
         * gets the value of attribute. Otherwise, set the value of attribute.
         * if the passed value is null, un-set the attribute.
         *
         * @param {string} name Name of the model attribute.
         * @param {*} [value] Value of the model attribute.
         * @returns {*|void} Returns value if value is not passed. Else void.
         */
        attribute: function(name,value){
            if(value === undefined){
                return this.model.get(name);
            }
            if(name !== undefined){
                if(value !== null)
                {
                    var data = {};
                    data[name] = value;
                    this.model.set(data);
                }else{
                    this.model.unset(name);
                }
            }
        },

        /**
         * Checks whether this view supports horizontal drag.
         *
         * @returns {boolean}
         */
        horizontalDrag: function(){
            return true;
        },

        /**
         * Checks whether this view supports vertical drag.
         *
         * @returns {boolean}
         */
        verticalDrag: function(){
            return true;
        }
    });

    var LifeLineView = BaseView.extend(
    /** @lends LifeLineView.prototype */
    {
        /**
         * @augments BaseView
         * @constructs
         * @class LifeLineView Represents the view for lifeline components in Sequence Diagrams.
         */
        initialize: function() {},

        // fetch default class from prefs
        className: sequenced.prefs.lifeline.class,

        verticalDrag: function(){
            return false;
        },

        render: function (paperID) {
            // set paper
            this.attribute("paperID", this.paperID || paperID || sequenced.prefs.paper.selector);

            // wrap d3 with custom drawing apis
            var d3Draw = d3_draw.wrap(d3.select(this.attribute("paperID")));

            // fetch global prefs for LifeLines
            var prefs = sequenced.prefs.lifeline;

            var lifeLine = d3Draw.lifeLine(this.attribute('centerPoint'), this.attribute('title'), prefs);
            var viewObj = this;
            var drag = d3.drag()
                .on("start",function(){
                    viewObj.dragStart(d3.event);
                })
                .on("drag", function() {
                    viewObj.dragMove(d3.event);
                })
                .on("end",function(){
                    viewObj.dragStop();
                });

            lifeLine.call(drag);

            this.el = lifeLine;
            return lifeLine;
        }

    });

    views.BaseView = BaseView;
    views.LifeLineView = LifeLineView;

    return sequenced;

}(SequenceD || {}));