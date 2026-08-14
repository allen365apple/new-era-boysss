export const TOPICS = [
	{
		name: '男性特權',
		slug: 'male-privilege',
		description: '從日常行為到制度安排，理解男性在不同情境裡享有的便利與責任。',
	},
	{
		name: '情感腳本',
		slug: 'emotional-scripts',
		description: '直男在戀愛、追求與情感表達裡被教會的慣性，以及重新選擇的可能。',
	},
	{
		name: '性別凝視',
		slug: 'gender-gaze',
		description: '談外貌焦慮、身體羞恥、情慾文化，以及我們如何看待彼此的身體。',
	},
	{
		name: '身份認同',
		slug: 'identity',
		description: '從陽剛氣質、男性友誼、成功想像到自我價值，重新理解「成為男人」。',
	},
	{
		name: '在地事件',
		slug: 'taiwan-context',
		description: '扣著台灣的性別事件、兵役經驗與社會脈絡，討論我們身邊正在發生的事。',
	},
	{
		name: '多元對話',
		slug: 'many-perspectives',
		description: '邀請不同性別、專業與生命經驗的人，把同一個問題放進更大的對話裡。',
	},
	{
		name: '聽眾互動',
		slug: 'listener-stories',
		description: '回應聽眾投稿、整理性別故事，讓個人經驗成為可以互相理解的公共記憶。',
	},
] as const;

export type Topic = (typeof TOPICS)[number];
