/**
 * @fileoverview gRPC-Web generated client stub for com.test.dubbo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as dao_pb from '../dao_pb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb';
import * as dubbo_test_pb from '../dubbo/test_pb';


export class TestClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfohello = new grpcWeb.AbstractClientBase.MethodInfo(
    dubbo_test_pb.TestReply,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    dubbo_test_pb.TestReply.deserializeBinary
  );

  hello(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<dubbo_test_pb.TestReply>;

  hello(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: dubbo_test_pb.TestReply) => void): grpcWeb.ClientReadableStream<dubbo_test_pb.TestReply>;

  hello(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: dubbo_test_pb.TestReply) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test/hello',
        request,
        metadata || {},
        this.methodInfohello,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test/hello',
    request,
    metadata || {},
    this.methodInfohello);
  }

  methodInfoecho = new grpcWeb.AbstractClientBase.MethodInfo(
    dubbo_test_pb.RspTestEcho,
    (request: dubbo_test_pb.ReqTestEcho) => {
      return request.serializeBinary();
    },
    dubbo_test_pb.RspTestEcho.deserializeBinary
  );

  echo(
    request: dubbo_test_pb.ReqTestEcho,
    metadata: grpcWeb.Metadata | null): Promise<dubbo_test_pb.RspTestEcho>;

  echo(
    request: dubbo_test_pb.ReqTestEcho,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: dubbo_test_pb.RspTestEcho) => void): grpcWeb.ClientReadableStream<dubbo_test_pb.RspTestEcho>;

  echo(
    request: dubbo_test_pb.ReqTestEcho,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: dubbo_test_pb.RspTestEcho) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test/echo',
        request,
        metadata || {},
        this.methodInfoecho,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test/echo',
    request,
    metadata || {},
    this.methodInfoecho);
  }

  methodInfoechoo = new grpcWeb.AbstractClientBase.MethodInfo(
    dao_pb.Echoo,
    (request: google_protobuf_wrappers_pb.StringValue) => {
      return request.serializeBinary();
    },
    dao_pb.Echoo.deserializeBinary
  );

  echoo(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null): Promise<dao_pb.Echoo>;

  echoo(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: dao_pb.Echoo) => void): grpcWeb.ClientReadableStream<dao_pb.Echoo>;

  echoo(
    request: google_protobuf_wrappers_pb.StringValue,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: dao_pb.Echoo) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test/echoo',
        request,
        metadata || {},
        this.methodInfoechoo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test/echoo',
    request,
    metadata || {},
    this.methodInfoechoo);
  }

  methodInfoechoos = new grpcWeb.AbstractClientBase.MethodInfo(
    dao_pb.Echoos,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    dao_pb.Echoos.deserializeBinary
  );

  echoos(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<dao_pb.Echoos>;

  echoos(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: dao_pb.Echoos) => void): grpcWeb.ClientReadableStream<dao_pb.Echoos>;

  echoos(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: dao_pb.Echoos) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test/echoos',
        request,
        metadata || {},
        this.methodInfoechoos,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test/echoos',
    request,
    metadata || {},
    this.methodInfoechoos);
  }

  methodInfoechooclear = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_wrappers_pb.Int32Value,
    (request: google_protobuf_empty_pb.Empty) => {
      return request.serializeBinary();
    },
    google_protobuf_wrappers_pb.Int32Value.deserializeBinary
  );

  echooclear(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_wrappers_pb.Int32Value>;

  echooclear(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_wrappers_pb.Int32Value) => void): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.Int32Value>;

  echooclear(
    request: google_protobuf_empty_pb.Empty,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_wrappers_pb.Int32Value) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test/echooclear',
        request,
        metadata || {},
        this.methodInfoechooclear,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test/echooclear',
    request,
    metadata || {},
    this.methodInfoechooclear);
  }

  methodInfoechooupdate = new grpcWeb.AbstractClientBase.MethodInfo(
    google_protobuf_wrappers_pb.BoolValue,
    (request: dao_pb.Echoo) => {
      return request.serializeBinary();
    },
    google_protobuf_wrappers_pb.BoolValue.deserializeBinary
  );

  echooupdate(
    request: dao_pb.Echoo,
    metadata: grpcWeb.Metadata | null): Promise<google_protobuf_wrappers_pb.BoolValue>;

  echooupdate(
    request: dao_pb.Echoo,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: google_protobuf_wrappers_pb.BoolValue) => void): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.BoolValue>;

  echooupdate(
    request: dao_pb.Echoo,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: google_protobuf_wrappers_pb.BoolValue) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test/echooupdate',
        request,
        metadata || {},
        this.methodInfoechooupdate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test/echooupdate',
    request,
    metadata || {},
    this.methodInfoechooupdate);
  }

}

export class Test1Client {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoecho = new grpcWeb.AbstractClientBase.MethodInfo(
    dubbo_test_pb.RspTestEcho,
    (request: dubbo_test_pb.ReqTestEcho) => {
      return request.serializeBinary();
    },
    dubbo_test_pb.RspTestEcho.deserializeBinary
  );

  echo(
    request: dubbo_test_pb.ReqTestEcho,
    metadata: grpcWeb.Metadata | null): Promise<dubbo_test_pb.RspTestEcho>;

  echo(
    request: dubbo_test_pb.ReqTestEcho,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.Error,
               response: dubbo_test_pb.RspTestEcho) => void): grpcWeb.ClientReadableStream<dubbo_test_pb.RspTestEcho>;

  echo(
    request: dubbo_test_pb.ReqTestEcho,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.Error,
               response: dubbo_test_pb.RspTestEcho) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/com.test.dubbo.Test1/echo',
        request,
        metadata || {},
        this.methodInfoecho,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/com.test.dubbo.Test1/echo',
    request,
    metadata || {},
    this.methodInfoecho);
  }

}

