import "vant/es/toast/style";
import { Toast } from "vant";
/**
 * @description: 校验状态码
 * @param {number} status
 */
export const checkStatus = (status: number): void => {
	switch (status) {
		case 400:
			Toast.fail("请求失败！请您稍后重试");
			break;
		case 401:
			Toast.fail("登录失效！请您重新登录");
			break;
		case 403:
			Toast.fail("当前账号无权限访问！");
			break;
		case 404:
			Toast.fail("你所访问的资源不存在！");
			break;
		case 405:
			Toast.fail("请求方式错误！请您稍后重试");
			break;
		case 408:
			Toast.fail("请求超时！请您稍后重试");
			break;
		case 500:
			Toast.fail("服务异常！");
			break;
		case 502:
			Toast.fail("网关错误！");
			break;
		case 503:
			Toast.fail("服务不可用！");
			break;
		case 504:
			Toast.fail("网关超时！");
			break;
		default:
			Toast.fail("请求失败！");
	}
};
