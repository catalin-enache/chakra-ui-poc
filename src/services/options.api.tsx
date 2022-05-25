import React from "react";

export type Options = Record<string, JSX.Element | string>;
export const getOptions = (search: string) => new Promise<Options>(
  (res) => setTimeout(() => res(!search ? {} : {  [`One ${search}`]: <span>One {search}</span>, [`Two ${search}`]: `Two ${search}`  }), 1000)
);
