type Login = {
  email: string;
  password: string;
};

type LoginAPIRes = {
  statusCode: number;
  statusText: string;
  data: {
    message: string;
  };
};
