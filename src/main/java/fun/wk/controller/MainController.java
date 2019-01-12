package fun.wk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 主页Controller
 */
@Controller
public class MainController {
	/**
	 * 返回网站首页
	 */
	@RequestMapping(value= {"/","/index","/main"})
	public String index() {
		return "index";
	}
	@RequestMapping("/fifty.do")
	@ResponseBody
	public String fifty() {
		return "json/fifty.json";
	}
}
