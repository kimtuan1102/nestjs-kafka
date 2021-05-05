<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Kafka](https://kafka.js.org/) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save @kimtuan1102/nestjs-kafka
```

### Synchronous Module Initialization

Register the `KafkaModule` synchronous with the `register()` method:

```javascript
@Module({
  imports: [
    KafkaModule.register([
      {
        name: 'HERO_SERVICE',
        options: {
          client: {
            clientId: 'hero',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'hero-consumer'
          }
        }
      },
    ]),
  ]
  ...
})

```

### Asynchronous Module Initialization

Register the `KafkaModule` asynchronous with the `registerAsync()` method:

```javascript
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    KafkaModule.registerAsync(['HERO_SERVICE'], {
            useFactory: async (configService: ConfigService) => {
                const broker = this.configService.get('broker');
                return [
                    {
                        name: 'HERO_SERVICE',
                        options: {
                              clientId: 'hero',
                              brokers: [broker],
                            },
                            consumer: {
                              groupId: 'hero-consumer'
                            }
                        }
                    }
                ];
            },
            inject: [ConfigService]
        })
  ]
  ...
})

```
### Asynchronous Module Initialization using config service
```javascript
import { KafkaModuleOption, KafkaOptionsFactory } from '../kafka';
import { KAFKA_INTEGRATION_SERVICE } from '../common/constants';

export class KafkaConfigService implements KafkaOptionsFactory {
  creatKafkaModuleOptions(): KafkaModuleOption[] {
    return [
      {
        name: 'HERO_SERVICE',
        options: {
          client: {
            clientId: clientId,
            brokers: brokers,
          },
          consumer: {
            groupId: clientId,
          },
        },
      },
    ];
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from '@kimtuan1102/nestjs-kafka';

@Module({
  imports: [
    KafkaModule.registerAsync(['HERO_SERVICE'], {
      imports: [ConfigModule],
      useClass: KafkaConfigService,
    },
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```
Full settings can be found:

| Config | Options |
| ------ | ------- | 
| client       | https://kafka.js.org/docs/configuration | 
| consumer     | https://kafka.js.org/docs/consuming#options |
| producer     | https://kafka.js.org/docs/producing#options |
| serializer   | |
| deserializer | |
| consumeFromBeginning | true/false |
| | |



### Subscribing

Subscribing to a topic to accept messages.

```javascript
export class Consumer {
  constructor(
    @Inject('HERO_SERVICE') private client: KafkaService
  ) {}

  onModuleInit(): void {
    this.client.subscribeToResponseOf('hero.kill.dragon', this)
  }

  @SubscribeTo('hero.kill.dragon')
  async getWorld(@Payload() data: KafkaMessage): Promise<void> {
    ...
  }

}

```

### Producing

Send messages back to kafka.

```javascript
const TOPIC_NAME = 'hero.kill.dragon';

export class Producer {
  constructor(
    @Inject('HERO_SERVICE') private client: KafkaService
  ) {}

  async post(message: string = 'Hello world'): Promise<RecordMetadata[]> {
    const result = await this.client.send({
      topic: TOPIC_NAME,
      messages: [
        {
          key: '1',
          value: message
        }
      ]
    });

    return result;
  }

}

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

* Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
* Website - [https://nestjs.com](https://nestjs.com/)
* Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
