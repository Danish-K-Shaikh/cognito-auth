function getErrorPayload(error, status = 500, msg = 'Something went wrong.') {
  if (error instanceof Error) error = { error: error.toString() };
  else if (error.error instanceof Error) error.error = error.toString();
  const payload = { status, msg, ...error };
  return payload;
}

module.exports = { getErrorPayload };
