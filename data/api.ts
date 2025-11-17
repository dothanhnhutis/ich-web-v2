import "server-only";
export class FetchAPIError<T> extends Error {
  isAPIError: boolean;
  response: FetchAPIResponse<T>;
  config: FetchAPIRequestConfig;

  constructor(message: string, response: FetchAPIResponse<T>) {
    super(message);
    this.name = "FetchAPIError";
    this.isAPIError = true;
    this.response = response;
    this.config = response.config;
  }
}

export class FetchAPINetWorkError extends Error {
  isAPINetworkError: boolean;
  config: FetchAPIRequestConfig;
  statusText: string;
  status: number;
  constructor(
    message: string,
    response: {
      config: FetchAPIRequestConfig;
      status: number;
      statusText: string;
    }
  ) {
    super(message);
    this.name = "FetchAPINetWorkError";
    this.isAPINetworkError = true;
    this.config = response.config;
    this.statusText = response.statusText;
    this.status = response.status;
  }
}

export interface FetchAPIRequestConfig extends RequestInit {
  url?: string;
  baseUrl?: string;
  params?: Record<string, string> | string | [string, string][];
  data?: unknown;
}

export interface FetchAPIResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: FetchAPIRequestConfig;
  request: Response;
}

type RequestInterceptor = (
  config: FetchAPIRequestConfig
) => FetchAPIRequestConfig | Promise<FetchAPIRequestConfig>;

type ResponseInterceptor<T> = (
  response: FetchAPIResponse<T>
) => FetchAPIResponse<T> | Promise<FetchAPIResponse<T>>;

export class FetchAPI {
  defaults: FetchAPIRequestConfig;
  interceptors: {
    request: RequestInterceptor[];
    response: ResponseInterceptor<unknown>[];
  };

  constructor(defaults: FetchAPIRequestConfig = {}) {
    this.defaults = defaults;
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  static create(defaults: FetchAPIRequestConfig = {}): FetchAPI {
    return new FetchAPI(defaults);
  }

  private async request<T = unknown>(
    config: FetchAPIRequestConfig
  ): Promise<FetchAPIResponse<T>> {
    // Gộp cấu hình mặc định và cấu hình truyền vào
    config = { ...this.defaults, ...config };

    // Áp dụng các interceptor cho request
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    // Xây dựng URL đầy đủ (kết hợp baseUrl, url và params nếu có)
    let url = config.url || "";

    if (config.baseUrl && !url.startsWith("http")) {
      url = config.baseUrl + url;
    }
    if (config.params) {
      const queryString = new URLSearchParams(config.params).toString();
      url += (url.includes("?") ? "&" : "?") + queryString;
    }

    // Chuẩn bị cấu hình cho fetch
    const fetchConfig: RequestInit = { ...config };

    // Nếu có data và method không phải GET thì gán data vào body
    if (config.data && config.method?.toUpperCase() !== "GET") {
      if (!(config.data instanceof FormData)) {
        fetchConfig.body = JSON.stringify(config.data);
        fetchConfig.headers = {
          "Content-Type": "application/json",
          ...config.headers,
        };
      } else {
        fetchConfig.body = config.data;
      }
    }

    // Gọi fetch
    let res: Response;
    try {
      res = await fetch(url, fetchConfig);
    } catch (error: unknown) {
      let message: string = `Lỗi mạng khi gọi ${url}`;
      let statusText: string = "NETWORK_ERROR";

      if (error instanceof TypeError) {
        const cause = (error as NodeJS.ErrnoException).cause;
        if (cause && typeof cause === "object" && "code" in cause) {
          statusText = (cause as { code?: string }).code || "";
          message =
            statusText === "ECONNREFUSED"
              ? "Kết nối với server bị từ chuối."
              : "Lỗi mạng không xác định";
        } else {
          message = `Lỗi TypeError không rõ nguyên nhân: ${error.message}`;
        }
      }

      throw new FetchAPINetWorkError(message, {
        config,
        statusText,
        status: 503,
      });
    }

    // const res = await fetch(url, fetchConfig);
    const response: FetchAPIResponse<T> = {
      data: await res.json().catch(() => null),
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config,
      request: res,
    };

    // Áp dụng các interceptor cho response
    let processedResponse = response;
    for (const interceptor of this.interceptors
      .response as ResponseInterceptor<T>[]) {
      processedResponse = await interceptor(processedResponse);
    }

    // Nếu phản hồi không thành công, ném lỗi
    if (!res.ok) {
      throw new FetchAPIError(processedResponse.statusText, processedResponse);
    }

    return processedResponse;
  }

  get<T = unknown>(
    url: string,
    config?: FetchAPIRequestConfig
  ): Promise<FetchAPIResponse<T>> {
    return this.request({ ...config, url, method: "GET" });
  }

  post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: FetchAPIRequestConfig
  ): Promise<FetchAPIResponse<T>> {
    return this.request({ ...config, url, data, method: "POST" });
  }

  patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: FetchAPIRequestConfig
  ): Promise<FetchAPIResponse<T>> {
    return this.request({ ...config, url, data, method: "PATCH" });
  }

  put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: FetchAPIRequestConfig
  ): Promise<FetchAPIResponse<T>> {
    return this.request({ ...config, url, data, method: "PUT" });
  }

  delete<T = unknown>(
    url: string,
    config?: FetchAPIRequestConfig
  ): Promise<FetchAPIResponse<T>> {
    return this.request({ ...config, url, method: "DELETE" });
  }
}

// // Ví dụ sử dụng:

// // Tạo instance với cấu hình mặc định
// const api = new API({
//   baseUrl: "https://api.example.com",
//   headers: {
//     Authorization: "Bearer token",
//   },
// });

// // Thêm request interceptor
// api.interceptors.request.push(async (config) => {
//   console.log("Request config:", config);
//   // Bạn có thể thêm các xử lý như thêm token, logging,...
//   return config;
// });

// // Thêm response interceptor
// api.interceptors.response.push(async (response) => {
//   console.log("Response:", response);
//   // Bạn có thể kiểm tra, chuyển đổi dữ liệu response,...
//   return response;
// });

// // Gọi API giống axios
// (async () => {
//   try {
//     const { data, status } = await api.post<{ result: string }>("/endpoint", {
//       key: "value",
//     });
//     console.log("Data:", data, "Status:", status);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();

interface FastifySchemaValidationError {
  keyword: string;
  instancePath: string;
  schemaPath: string;
  params: Record<string, unknown>;
  message?: string;
}

interface FastifyZodValidateError {
  error: string;
  message: string;
  statusCode: number;
  details: {
    issues: FastifySchemaValidationError[];
    method: string;
    url: string;
  };
}

export const hasFastifyZodValidationError = (
  error: unknown
): error is FetchAPIError<FastifyZodValidateError> => {
  return (
    error instanceof FetchAPIError &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    "statusCode" in error.response.data &&
    "details" in error.response.data &&
    typeof error.response.data.details === "object" &&
    "issues" in error.response.data.details &&
    "method" in error.response.data.details &&
    "url" in error.response.data.details
  );
};
