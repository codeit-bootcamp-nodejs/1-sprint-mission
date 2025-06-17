class UnauthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthError";
  }
}

export default UnauthError;
