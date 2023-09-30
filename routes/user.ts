import express, { Express, Request, Response } from "express";
import { signUp, login, updateSlackUrl } from "../controllers/user";
import { checkUserId } from "../controllers/validation";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const retJson = await signUp(req.body);
  res.status(retJson.statusCode).json(retJson.body);
});

router.post("/login", async (req: Request, res: Response) => {
  const retJson = await login(req.body);
  res.status(retJson.statusCode).json(retJson.body);
});

router.put("/user/:_id", checkUserId, async (req: Request, res: Response) => {
  const retJson = await updateSlackUrl({ ...req.params, ...req.body });
  res.status(retJson.statusCode).json(retJson.body);
});

export default router;
