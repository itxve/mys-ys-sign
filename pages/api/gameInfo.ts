import { S } from "../../endpoint";
import type { NextApiRequest, NextApiResponse } from "next";
import { runCorsMiddleware } from "@/middleware";
/**
 * 用户信息接口接口
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runCorsMiddleware(req, res);
  const { cookie } = req.body;
  const fullInfo: any = await S.getUserFullInfo(cookie);
  const avatar_url = fullInfo.data.user_info.avatar_url;
  console.log("avatar_url", avatar_url);
  S.userGameInfo(cookie)
    .then((rt) => {
      const { message, data } = rt;
      if (message === "OK") {
        //添加米游社头像
        data.list.forEach((e: any) => {
          e.avatar_url = avatar_url;
        });
        res.status(200).send(data);
      } else {
        res.status(400).send({ message });
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
}
