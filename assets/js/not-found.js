"use strict";

// Load deferred styles
var addStylesNode = $("#deferred-styles");
var replacement = $("<div />");
replacement.html(addStylesNode.text());
$("head").append(replacement);
addStylesNode.remove();
