import Elysia from "elysia"
import { t } from "elysia"   

export const userModel = t.Object({
      id: t.Numeric(),
      name: t.String(),
      email: t.String(),
    })