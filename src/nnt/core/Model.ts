export class ModelError {
  constructor(code?: number, msg?: string) {
    this.code = code;
    this.message = msg;
  }

  code: number;
  message: string;
}

export class STATUS {
  static UNKNOWN = -1000;
  static EXCEPTION = -999; // 遇到了未处理的异常
  static ROUTER_NOT_FOUND = -998; // 没有找到路由
  static CONTEXT_LOST = -997; // 上下文丢失
  static MODEL_ERROR = -996; // 恢复模型失败
  static PARAMETER_NOT_MATCH = -995; // 参数不符合要求
  static NEED_AUTH = -994; // 需要登陆
  static TYPE_MISMATCH = -993; // 参数类型错误
  static FILESYSTEM_FAILED = -992; // 文件系统失败
  static FILE_NOT_FOUND = -991; // 文件不存在
  static ARCHITECT_DISMATCH = -990; // 代码不符合标准架构
  static SERVER_NOT_FOUND = -989; // 没有找到服务器
  static LENGTH_OVERFLOW = -988; // 长度超过限制
  static TARGET_NOT_FOUND = -987; // 目标对象没有找到
  static PERMISSIO_FAILED = -986; // 没有权限
  static WAIT_IMPLEMENTION = -985; // 等待实现
  static ACTION_NOT_FOUND = -984; // 没有找到动作
  static TARGET_EXISTS = -983; // 已经存在
  static STATE_FAILED = -982; // 状态错误
  static UPLOAD_FAILED = -981; // 上传失败
  static MASK_WORD = -980; // 有敏感词
  static SELF_ACTION = -979; // 针对自己进行操作
  static PASS_FAILED = -978; // 验证码匹配失败
  static OVERFLOW = -977; // 数据溢出
  static AUTH_EXPIRED = -976; // 授权过期
  static SIGNATURE_ERROR = -975; // 签名错误
  static FORMAT_ERROR = -974;  // 返回的数据格式错误
  static CONFIG_ERROR = -973; // 配置错误
  static PRIVILEGE_ERROR = -972; // 权限错误
  static LIMIT = -971; // 受到限制

  static IM_CHECK_FAILED = -899; // IM检查输入的参数失败
  static IM_NO_RELEATION = -898; // IM检查双方不存在关系

  static SOCK_WRONG_PORTOCOL = -860; // SOCKET请求了错误的通讯协议
  static SOCK_AUTH_TIMEOUT = -859; // 因为连接后长期没有登录，所以服务端主动断开了链接
  static SOCK_SERVER_CLOSED = -858; // 服务器关闭

  static THIRD_FAILED = -5; // 第三方出错
  static MULTIDEVICE = -4; // 多端登陆
  static HFDENY = -3; // 高频调用被拒绝（之前的访问还没有结束) high frequency deny
  static TIMEOUT = -2; // 超时
  static FAILED = -1; // 一般失败
  static OK = 0; // 成功
}
