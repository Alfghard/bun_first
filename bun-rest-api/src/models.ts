import Elysia from "elysia"
import { t } from "elysia"   

export const siginDTO = t.Object({
      username: t.String(),
      password: t.String()
    })