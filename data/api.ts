import "server-only";
export class FetchAPIError<T> extends Error {
  isAPIError: boolean;
  response: FetchAPIResponse<T>;
  config: FetchAPIRequestConfig;

  constructor(message: string, response: FetchAPIResponse<T>) {
    super(message);
    this.name = "FechApiError";
    this.isAPIError = true;
    this.response = response;
    this.config = response.config;
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
    } catch (error: any) {
      // Nhận dạng lỗi ECONNREFUSED hoặc network error
      if (error?.cause?.code === "ECONNREFUSED") {
        throw new FetchAPIError(
          `Không thể kết nối đến server (${url}): ${error.cause.message}`,
          {
            data: null,
            status: 0,
            statusText: "ECONNREFUSED",
            headers: new Headers(),
            config,
            request: new Response(),
          }
        );
      }

      // Các lỗi fetch khác (timeout, DNS, ...)
      throw new FetchAPIError(`Lỗi mạng khi gọi ${url}: ${error.message}`, {
        data: null,
        status: 0,
        statusText: "NETWORK_ERROR",
        headers: new Headers(),
        config,
        request: new Response(),
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
