export const SUBSCRIBER_MAP = new Map();
export const SUBSCRIBER_OBJECT_MAP = new Map();
export const INSTANCE_MAP = new Map();

export const SubscribeTo = (topic: string): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    SUBSCRIBER_MAP.set(topic, { target, propertyKey });
    return descriptor;
  };
};
