import { Module } from '@nestjs/common';
import { UkrainianDictionaryStrategy } from './dictionary/strategies/ukrainian-dictionary.strategy';
import { EnglishDictionaryStrategy } from './dictionary/strategies/english-dictionary.strategy';
import { DictionaryFactory } from './dictionary/dictionary.factory';

@Module({
  providers: [UkrainianDictionaryStrategy, EnglishDictionaryStrategy, DictionaryFactory],
  exports: [DictionaryFactory],
})
export class WordModule {}
