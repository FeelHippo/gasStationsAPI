import { Application } from "express";

export default interface Route {
  path: string;
  app: Application;
}