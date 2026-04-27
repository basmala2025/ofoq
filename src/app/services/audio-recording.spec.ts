import { TestBed } from '@angular/core/testing';

import { AudioRecording } from './audio-recording';

describe('AudioRecording', () => {
  let service: AudioRecording;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecording);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
