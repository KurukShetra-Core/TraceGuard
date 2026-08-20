type TOrigin = {
  endpoint: string | null;
  filePath: string | null;
};

interface SDKError {
  message: string;
  code?: string;
  raw?: any;
}

// Use Generics for flexible metadata typing
class SDKResponse<T = TOrigin> {
  event: string;
  message: string;
  error: SDKError | null;
  metadata: T | null;
  statusCode: number | null;
  errorType?: string;
  origin: TOrigin;

  constructor(
    event: string,
    origin: TOrigin, // Moved before optional arg
    statusCode: number | null = null,
  ) {
    this.event = event;
    this.origin = origin;
    this.statusCode = statusCode;
    this.message = "";
    this.error = null;
    this.metadata = null;
    this.errorType = undefined;
  }

  setSuccess(metadata: T, message?: string): this {
    this.metadata = metadata;
    this.message = message || "Success";
    this.error = null;
    this.errorType = undefined;
    return this;
  }

  setError(
    error: Partial<SDKError>,
    errorType: string,
    message?: string,
  ): this {
    // Ensure we always have a valid SDKError object
    this.error = {
      message: error.message || message || "An error occurred",
      code: error.code,
      raw: error,
    };
    this.errorType = errorType;
    this.message = this.error.message;
    this.metadata = null;
    return this;
  }

  isSuccess(): boolean {
    return (
      this.statusCode !== null &&
      this.statusCode >= 200 &&
      this.statusCode < 300
    );
  }

  isError(): boolean {
    return (
      this.error !== null ||
      (this.statusCode !== null &&
        (this.statusCode < 200 || this.statusCode >= 300))
    );
  }
}
