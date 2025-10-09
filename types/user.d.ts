type User = {
  id: string;
  email: string;
  username: string;
  status: string;
  avatar: ImageURL | null;
  deactived_at: Date;
  role_count: number;
  created_at: Date;
  updated_at: Date;
};

type UserWithoutPassword = User & {
  has_password: boolean;
};

type UserPassword = User & {
  password_hash: string;
};

type QueryUsers = { users: UserWithoutPassword[]; metadata: Metadata };

type UserDetail = UserWithoutPassword & {
  roles: Role[];
};

type UserDetailAPIRes = {
  statusCode: number;
  statusText: string;
  data: UserDetail;
};
