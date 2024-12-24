import { Button } from "@mui/material";
import React, { ComponentProps, Ref } from "react";

export interface ButtonPropType extends ComponentProps<typeof Button> {
  forwardedRef?: Ref<any>;
  loading?: boolean;
  name?: any;
}