function protectThis(objectInstance) {
    Object.getOwnPropertyNames( Object.getPrototypeOf(objectInstance) )
        .filter(maybeFunctionName => typeof objectInstance[maybeFunctionName] === 'function')
        .forEach(function(functionName) {
            const initialFunctionDefinition = objectInstance[functionName];
            objectInstance[functionName] = function()  {
                return initialFunctionDefinition.apply(objectInstance, arguments);
            }
        });
}

export {protectThis}