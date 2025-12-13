export interface ValidationError {
  /**
   * Object that was validated.
   *
   * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
   */
  target?: object;
  /**
   * Object's property that haven't pass validation.
   */
  property: string;
  /**
   * Value that haven't pass a validation.
   *
   * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
   */
  value?: any;
  /**
   * Constraints that failed validation with error messages.
   */
  constraints?: {
    [type: string]: string;
  };
  /**
   * Contains all nested validation errors of the property.
   */
  children?: ValidationError[];
}

export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiResponseError;
  timestamp: string;
  path: string;
}

export interface ApiResponseError {
  message: string;
  details?: any;
  code: string;
}

export interface FailedApiResponse<T = null> extends ApiResponse<T> {
  success: false;
  error: ApiResponseError;
}

export interface SuccessApiResponse<T> extends ApiResponse<T> {
  success: true;
}
