export const permissionRoutes: Record<string, RegExp> = {
  "read:user:*": /^\/admin\/users$/,
  //   "update:user": /^\/admin\/users(?:[0-9a-zA-Z\/\-])*?$/,
  "create:user": /^\/admin\/users\/create$/,
  "update:user": /^\/admin\/users\/(?:[0-9a-zA-Z/-])*\/edit$/,

  "read:role:*": /^\/admin\/roles$/,
  //   "update:user": /^\/admin\/users(?:[0-9a-zA-Z\/\-])*?$/,
  "create:role": /^\/admin\/roles\/create$/,
  "update:role": /^\/admin\/roles\/(?:[0-9a-zA-Z/-])\/edit*?$/,

  "read:warehouse:*": /^\/admin\/warehouses$/,
  //   "update:user": /^\/admin\/users(?:[0-9a-zA-Z\/\-])*?$/,
  "create:warehouse": /^\/admin\/warehouses\/create$/,
  "update:warehouse": /^\/admin\/warehouses\/(?:[0-9a-zA-Z/-])\/edit*?$/,

  //   "read:role:*": /^\/admin\/roles(?:[0-9a-zA-Z\/\-])*?$/,
  //   "read:warehouse:*": /^\/admin\/warehouses(?:[0-9a-zA-Z\/\-])*?$/,
  //   "read:packaging:*": /^\/admin\/packagings(?:[0-9a-zA-Z\/\-])*?$/,
};
