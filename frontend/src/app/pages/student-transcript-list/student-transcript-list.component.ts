import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranscriptListItemComponent } from '../../components/transcript-list-item/transcript-list-item.component';

@Component({
  selector: 'app-student-transcript-list',
  imports: [CommonModule, TranscriptListItemComponent],
  template: `
    <div class="transcript-list-container">
      <!-- Topic/Capture Period Title -->
      <h1 class="topic-header">{{ topicName }}</h1>

      <!-- List of Transcript Items -->
      <div class="transcript-list">
          
          <app-transcript-list-item
            *ngFor="let transcript of transcripts"
            [transcript]="transcript">
          </app-transcript-list-item>
      </div>
    </div>
  `,
  styleUrls: ['./student-transcript-list.component.css'],
})
export class StudentTranscriptListComponent implements OnInit {
  topicName: string = 'Topic Name';
  transcripts: Array<{ title: string; text: string; imageUrl: string }> = [];

  // Updated static data stored as an array, using the integer index
  captureData = [
    {
      topicName: 'Gravity',
      transcripts: [
        {
          title: 'Gravity and jumping',
          text: "Gravity is the force that pulls you back down so if you jumped up and down you would go up and then come back down on earth. But if you were on a planet for instance the moon you would if you jumped it would take you longer to come back down since there is less gravity. But another planet would have more gravity and when you would jump up it would pull you down faster. That is one example of gravity.",
          imageUrl: 'https://files09.oaiusercontent.com/file-RnstVLJp6686ERCBvSztpS?se=2025-04-11T06%3A35%3A38Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D2aa491e1-e9e6-47c8-a08e-eebbfedaa6f8.webp&sig=hXdm8HlxbRPSkhuw1k6MYH6E%2BqIUi8BNXyD7D6F0y8o%3D',
        },
        {
          title: 'Falling Leaves: Gravity',
          text: "As I'm looking out my window I'm seeing that some of the leaves on the trees are falling because of gravity because gravity is pulling htem towards the earth so leaves are falling down and this is science because gravity is one of the forces of science and when it's falling that's gravity in action.",
          imageUrl: 'assets/placeholder.png',
        },
        {
          title: 'Edit Test',
          text: "This is a test of the edit functionality. You can edit this text.",
          imageUrl: 'assets/placeholder.png',
        },
      ],
    },
    {
      topicName: 'Friction',
      transcripts: [
        {
          title: 'Friction Prevents Sliding',
          text: "Friction is what keeps us from sliding around all the time. It helps us not to move around a lot. If there is not a lot of friction, you would slide around. If there is a lot of friction, it would be kind of hard to like slide your feet on the ground. Ice skating, there isn't a lot of friction. But when you rub your hands together, there is a lot of friction because it makes your hands warm.  If it's hard to move something over a surface, then there's friction. Friction keeps us from sliding around. I said that. Even though something moves really easily, there's still friction. Because it has to stop somewhere. If there were no friction, we would just slide around and never stop. If we bumped into each other, we would just move. We would keep moving until there's friction.",
          imageUrl: 'assets/placeholder.png',
        },
        {
          title: 'No Friction, She Slipped',
          text: "When it's raining, there is not a lot of friction. Because there's water on the ground. Water is really slippery. And so on concrete is already slippery a little bit as it is. It doesn't have a lot of friction.  Especially like really smooth concrete. And so when it's wet, you're gonna slide around a lot until there is friction. That's why she slipped on the sidewalk. Because she was running, and there's a lot of force when you run. And so, when you don't have any friction and have a lot of force, then you're gonna like slide and since human bodies are like, they're kind of top-heavy I guess. They could be top-heavy. Then she would like fall down I guess, maybe. But in fact, the matter is she slipped because there was no friction.",
          imageUrl: 'assets/placeholder.png',
        },
      ],
    },
    {
      topicName: 'General',
      transcripts: [
        {
          title: 'General Transcript 1',
          text: 'General transcript preview: ut enim ad minim veniam...',
          imageUrl: 'assets/placeholder.png',
        },
        {
          title: 'General Transcript 2',
          text: 'General transcript preview: excepteur sint occaecat...',
          imageUrl: 'assets/placeholder.png',
        },
      ],
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capture the parameter as a string and convert it to a number.
    const captureIdStr = this.route.snapshot.paramMap.get('captureId');
    const captureId = captureIdStr ? parseInt(captureIdStr, 10) : 0;

    switch (captureId) {
      case 0:
        this.topicName = this.captureData[0].topicName;
        this.transcripts = this.captureData[0].transcripts;
        break;
      case 1:
        this.topicName = this.captureData[1].topicName;
        this.transcripts = this.captureData[1].transcripts;
        break;
      case 2:
        this.topicName = this.captureData[2].topicName;
        this.transcripts = this.captureData[2].transcripts;
        break;
      default:
        this.topicName = 'Unknown Topic';
        this.transcripts = [];
    }
  }
}
