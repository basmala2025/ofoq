import { TestBed } from '@angular/core/testing';

import { AudioRecordingServiceTs } from './audio-recording.service.ts';

describe('AudioRecordingServiceTs', () => {
  let service: AudioRecordingServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecordingServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
