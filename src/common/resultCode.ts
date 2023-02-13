export interface IResponse {
  status: number;
  code: string;
  message?: string;
}

const resultCode: Record<string, IResponse> = {
  SUCCESS: { status: 200, code: 'OK', message: 'success' },
  CREATED: { status: 201, code: 'CREATED', message: 'success create data' },
  INVALID_PARAM: { status: 400, code: 'INVALID_PARAMETER', message: 'invalid parameter' },
  NOT_FOUND: { status: 404, code: 'NOT_FOUND', message: 'not found data' },
  PINATA_ERROR: { status: 500, code: 'PINATA_ERROR', message: 'pinata error occrred' },
  UNKNOWN: { status: 500, code: 'UNKNOWN', message: 'unknown error occurred' },
};

export default resultCode;
