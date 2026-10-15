import { Global, Module } from '@nestjs/common';
import { BunnyCDNService } from './bunny.service';

@Global()
@Module({
  providers: [BunnyCDNService],
  exports: [BunnyCDNService],
})
export class CDNModule {}
