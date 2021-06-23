import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as dao_pb from '../dao_pb';


export class ReqTestEcho extends jspb.Message {
  getInput(): string;
  setInput(value: string): ReqTestEcho;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReqTestEcho.AsObject;
  static toObject(includeInstance: boolean, msg: ReqTestEcho): ReqTestEcho.AsObject;
  static serializeBinaryToWriter(message: ReqTestEcho, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReqTestEcho;
  static deserializeBinaryFromReader(message: ReqTestEcho, reader: jspb.BinaryReader): ReqTestEcho;
}

export namespace ReqTestEcho {
  export type AsObject = {
    input: string,
  }
}

export class RspTestEcho extends jspb.Message {
  getOutput(): string;
  setOutput(value: string): RspTestEcho;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RspTestEcho.AsObject;
  static toObject(includeInstance: boolean, msg: RspTestEcho): RspTestEcho.AsObject;
  static serializeBinaryToWriter(message: RspTestEcho, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RspTestEcho;
  static deserializeBinaryFromReader(message: RspTestEcho, reader: jspb.BinaryReader): RspTestEcho;
}

export namespace RspTestEcho {
  export type AsObject = {
    output: string,
  }
}

export class TestReply extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): TestReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TestReply.AsObject;
  static toObject(includeInstance: boolean, msg: TestReply): TestReply.AsObject;
  static serializeBinaryToWriter(message: TestReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TestReply;
  static deserializeBinaryFromReader(message: TestReply, reader: jspb.BinaryReader): TestReply;
}

export namespace TestReply {
  export type AsObject = {
    message: string,
  }
}

