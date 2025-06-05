// errorHandler.js
import logErrorToSalesforce from '@salesforce/apex/ErrorLoggingService.logClientError';

export async function handleError(componentName, methodName, error, severity = 'Medium', relatedRecordId = null, callback) {
  const errorMessage = extractErrorMessage(error);
  const stack = error?.stack || '';
  console.error(`[${componentName} > ${methodName}]`, errorMessage);

  try {
    await logErrorToSalesforce({
      componentName,
      methodName,
      message: errorMessage,
      stack,
      severity,
      relatedRecordId
    });
  } catch (e) {
    console.warn('Failed to log error in Salesforce:', e);
  }

  if (typeof callback === 'function') {
    callback({ message: errorMessage, stack });
  }
}

function extractErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error.body?.message) return error.body.message;
  if (error.message) return error.message;
  return JSON.stringify(error);
}