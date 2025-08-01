import { fork, ChildProcess } from "child_process";
import { ProcessFileRequestMessage, ResponseMessage } from "./types";

export default class WorkerPool {
  private readonly numProcesses: number;
  private readonly childProcess: ChildProcess[] = [];
  private resolve: ((message: ResponseMessage) => void)[] = [];

  constructor(numProcesses = 8) {
    this.numProcesses = numProcesses;
    for (let i = 0; i < this.numProcesses; i++) {
      const child = fork("./src/worker.js");
      child.on("message", this.onMessage.bind(this));
      this.childProcess.push(child);
    }
  }
  private onMessage(message: ResponseMessage) {
    this.resolve[message.id](message);
  }
  public async processFile(message: Omit<ProcessFileRequestMessage, "id">) {
    const self = this;
    return new Promise<ResponseMessage>((resolve) => {
      const id = self.resolve.length;
      self.childProcess[id % self.numProcesses].send({ ...message, id });
      self.resolve.push(resolve);
    });
  }
  public exit() {
    this.childProcess.forEach((child) => child.kill());
  }
}
