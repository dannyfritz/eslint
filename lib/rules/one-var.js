/**
 * @fileoverview A rule to ensure the use of a single variable declaration.
 * @author Ian Christian Myers
 * @copyright 2015 Danny Fritz. All rights reserved.
 * @copyright 2013 Ian Christian Myers. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var MODE = context.options[0];

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    var functionStack = [];

    /**
     * Increments the functionStack counter.
     * @returns {Number} The new length of functionStack.
     * @private
     */
    function startFunction() {
        return functionStack.push(false);
    }

    /**
     * Decrements the functionStack counter.
     * @returns {Boolean} The value popped from functionStack.
     * @private
     */
    function endFunction() {
        return functionStack.pop();
    }

    /**
     * Determines if there is more than one var statement in the current scope.
     * @param {ASTNode} node The node to check.
     * @returns {Boolean} Returns true if it is the first var declaration, false if not.
     * @private
     */
    function checkOnlyOneVar() {
        if (functionStack[functionStack.length - 1]) {
            return false;
        } else {
            functionStack[functionStack.length - 1] = true;
            return true;
        }
    }

    /**
     * Determines if there is more than one declaration in the current var.
     * @param {ASTNode} node The node to check.
     * @returns {Boolean} Returns true if there is 1 declaration on a var, false if not.
     * @private
     */
    function checkOnlyOneDeclarationPerVar(node) {
        if (node.declarations.length > 1) {
            return false;
        } else {
            return true;
        }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "Program": startFunction,
        "FunctionDeclaration": startFunction,
        "FunctionExpression": startFunction,
        "ArrowFunctionExpression": startFunction,

        "VariableDeclaration": function(node) {
            if (MODE === "never") {
                if (!checkOnlyOneDeclarationPerVar(node)) {
                    context.report(node, "Split 'var' declaration into multiple statements.");
                }
            } else {
                if (!checkOnlyOneVar()) {
                    context.report(node, "Combine this with the previous 'var' statement.");
                }
            }
        },

        "Program:exit": endFunction,
        "FunctionDeclaration:exit": endFunction,
        "FunctionExpression:exit": endFunction,
        "ArrowFunctionExpression:exit": endFunction
    };

};
