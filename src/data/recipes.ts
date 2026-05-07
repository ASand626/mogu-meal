import { Recipe } from '../types';

export const recipes: Recipe[] = [
  // ---------------- 主菜（メインディッシュ）15品 ----------------
  {
    id: 'm1',
    name: '無水で作る！濃厚チキンと野菜の本格カレー',
    ingredients: [
      { name: '鶏もも肉', amount: '300g' },
      { name: '玉ねぎ', amount: '2個' },
      { name: 'トマト', amount: '3個' },
      { name: 'セロリ', amount: '1/2本' },
      { name: 'にんにく（すりおろし）', amount: '1片分' },
      { name: 'カレールー', amount: '4かけ' }
    ],
    steps: [
      '玉ねぎ、セロリはみじん切りにし、トマトはざく切りにします。鶏肉は一口大に切ります。',
      'ホットクックの内鍋に、玉ねぎ、セロリ、トマト、にんにくを敷き詰め、その上に鶏肉をのせます。',
      '水を一切入れず、カレールーを野菜と肉の上に散らします。',
      'ホットクックの「チキンと野菜のカレー（無水カレー）」メニューを選んでスタートします。',
      '完成したら、ルーが完全に溶けるように全体をしっかりかき混ぜます。'
    ],
    cookingTime: 10,
    appliance: ['ホットクック'],
    tags: ['子供向け', '肉', '野菜'],
    branchOptions: [
      { type: '形状変化', description: '野菜の食感を完全に消すため、完成後に具材を取り出してブレンダーにかけ、なめらかなルーにする', targetDislikedIngredients: ['玉ねぎ', 'セロリ', 'トマト'] },
      { type: '取り分け', description: 'ルーを入れる前に煮込み、野菜と肉のスープとして子供用に取り分ける', targetDislikedIngredients: ['スパイス'] }
    ]
  },
  {
    id: 'm2',
    name: 'ホロホロ豚の角煮（大根入り）',
    ingredients: [
      { name: '豚バラブロック肉', amount: '400g' },
      { name: '大根', amount: '1/3本' },
      { name: '生姜', amount: '1片' },
      { name: '醤油', amount: '大さじ4' },
      { name: '酒', amount: '大さじ3' },
      { name: '砂糖', amount: '大さじ3' },
      { name: '水', amount: '100ml' }
    ],
    steps: [
      '豚肉は4cm角に大きく切り、フライパンで表面に軽く焼き色がつくまで焼いて脂を落とします。',
      '大根は2cm厚さの半月切りにし、生姜は薄切りにします。',
      'ホットクックの内鍋にすべての材料と調味料を入れます。',
      '「豚の角煮」メニューを選んでスタートします。',
      '完成後、一度冷ますと味が大根により染み込みます。'
    ],
    cookingTime: 15,
    appliance: ['ホットクック', 'フライパン'],
    tags: ['肉'],
    branchOptions: [
      { type: '形状変化', description: '豚肉を細かくほぐしてごはんに乗せ、角煮丼風にする', targetDislikedIngredients: ['豚肉'] },
      { type: '味変', description: '脂っこさを和らげるため、食べる前にゆで卵を添えて味をマイルドにする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm3',
    name: 'フライパン1つで！鮭のちゃんちゃん焼き',
    ingredients: [
      { name: '生鮭の切り身', amount: '3切れ' },
      { name: 'キャベツ', amount: '1/4玉' },
      { name: '玉ねぎ', amount: '1/2個' },
      { name: 'しめじ', amount: '1/2パック' },
      { name: '味噌', amount: '大さじ3' },
      { name: '砂糖', amount: '大さじ2' },
      { name: '酒', amount: '大さじ2' },
      { name: 'バター', amount: '20g' }
    ],
    steps: [
      'キャベツはざく切り、玉ねぎは薄切り、しめじは石づきを取ってほぐします。',
      '味噌、砂糖、酒を混ぜ合わせて味噌ダレを作ります。',
      'フライパンに油（分量外）を熱し、鮭の両面を軽く焼きます。',
      '鮭の周りに野菜を敷き詰め、上から味噌ダレとバターを乗せます。',
      'フタをして弱中火で10分ほど蒸し焼きにし、全体に火が通ったら完成です。'
    ],
    cookingTime: 15,
    appliance: ['フライパン'],
    tags: ['魚', '野菜'],
    branchOptions: [
      { type: '形状変化', description: '鮭の骨を抜き、野菜と一緒に細かく刻んでチャーハンの具にする', targetDislikedIngredients: ['魚', 'キャベツ'] },
      { type: '味変', description: '子供用は味噌を控えめにし、マヨネーズを少し足してまろやかにする', targetDislikedIngredients: ['味噌'] }
    ]
  },
  {
    id: 'm4',
    name: 'ヘルシオでおまかせ！鶏のから揚げ（揚げない）',
    ingredients: [
      { name: '鶏もも肉', amount: '400g' },
      { name: '醤油', amount: '大さじ2' },
      { name: '酒', amount: '大さじ1' },
      { name: 'ごま油', amount: '小さじ1' },
      { name: 'すりおろし生姜', amount: '小さじ1' },
      { name: '片栗粉', amount: '大さじ4' }
    ],
    steps: [
      '鶏肉は少し大きめの一口大に切ります。',
      'ポリ袋に鶏肉、醤油、酒、ごま油、生姜を入れてよく揉み込み、15分ほど置きます。',
      '袋に片栗粉を加え、空気を入れて振り、全体に粉をまぶします。',
      'ヘルシオの角皿に調理網をのせ、鶏肉の皮目を上にして並べます。',
      '「から揚げ（ノンフライ）」メニューでオーブン加熱します。'
    ],
    cookingTime: 10,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['子供向け', '肉', '時短'],
    branchOptions: [
      { type: '取り分け', description: '下味の段階で醤油を減らしたものを子供用に取り分ける', targetDislikedIngredients: [] },
      { type: '形状変化', description: 'お肉を細かく刻んで、ご飯に混ぜておにぎりにする', targetDislikedIngredients: ['鶏肉'] }
    ]
  },
  {
    id: 'm5',
    name: 'たっぷり玉ねぎのふっくら和風ハンバーグ',
    ingredients: [
      { name: '合いびき肉', amount: '300g' },
      { name: '玉ねぎ', amount: '1個' },
      { name: '卵', amount: '1個' },
      { name: 'パン粉', amount: '大さじ3' },
      { name: '牛乳', amount: '大さじ2' },
      { name: 'ポン酢', amount: '適量' },
      { name: '大根おろし', amount: '適量' }
    ],
    steps: [
      '玉ねぎを細かいみじん切りにし、耐熱皿に入れてラップをし、ヘルシオのレンジ機能で3分加熱して冷まします。',
      'ボウルにひき肉、冷ました玉ねぎ、卵、パン粉、牛乳を入れ、粘りが出るまでよくこねます。',
      '空気を抜きながら小判型に成形し、真ん中を少し凹ませます。',
      'フライパンに油をひいて両面に焼き色をつけ、フタをして弱火で7〜8分蒸し焼きにします。',
      'お皿に盛り、大根おろしとポン酢をかけていただきます。'
    ],
    cookingTime: 20,
    appliance: ['フライパン', 'ヘルシオ（オーブン/レンジ機能）'],
    tags: ['子供向け', '肉'],
    branchOptions: [
      { type: '味変', description: 'ポン酢の代わりに、子供向けにケチャップ＆ソースに変更する', targetDislikedIngredients: ['酸味', 'ポン酢', '大根おろし'] },
      { type: '形状変化', description: 'ハンバーグを崩してミートソース風にアレンジする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm6',
    name: 'ブリの照り焼き ふっくら仕上げ',
    ingredients: [
      { name: 'ブリの切り身', amount: '3切れ' },
      { name: '醤油', amount: '大さじ2' },
      { name: '酒', amount: '大さじ2' },
      { name: 'みりん', amount: '大さじ2' },
      { name: '砂糖', amount: '大さじ1' },
      { name: '小麦粉', amount: '適量' }
    ],
    steps: [
      'ブリに両面薄く小麦粉をまぶします（タレが絡みやすくなり、ふっくら仕上がります）。',
      'フライパンに油を中火で熱し、ブリの両面にこんがりと焼き色をつけます。',
      '余分な油をキッチンペーパーで拭き取ります。',
      '醤油、酒、みりん、砂糖を合わせたタレをフライパンに流し入れます。',
      'スプーンでタレをブリにかけながら、照りが出るまで煮詰めます。'
    ],
    cookingTime: 15,
    appliance: ['フライパン'],
    tags: ['魚', '時短'],
    branchOptions: [
      { type: '形状変化', description: '骨を取り除き、小さくほぐしてごはんに乗せる', targetDislikedIngredients: ['魚'] },
      { type: '味変', description: '甘めのタレが苦手な場合は、シンプルに塩焼きに変更する', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm7',
    name: 'ほったらかし絶品！鶏肉と大根の煮物',
    ingredients: [
      { name: '鶏もも肉', amount: '300g' },
      { name: '大根', amount: '1/2本' },
      { name: '醤油', amount: '大さじ3' },
      { name: 'みりん', amount: '大さじ3' },
      { name: '酒', amount: '大さじ2' },
      { name: '砂糖', amount: '大さじ1' },
      { name: '水', amount: '200ml' }
    ],
    steps: [
      '大根は皮をむいて2cm幅の半月切りにし、鶏肉は一口大に切ります。',
      'ホットクックの内鍋に大根を敷き、その上に鶏肉を置きます。',
      '水、醤油、みりん、酒、砂糖を合わせたものを上から回しかけます。',
      '「鶏肉と大根の煮物」または煮物モードでスタートします。',
      '完成後、少し時間をおくとさらに大根に味が染み込みます。'
    ],
    cookingTime: 10,
    appliance: ['ホットクック'],
    tags: ['子供向け', '肉', '野菜'],
    branchOptions: [
      { type: '取り分け', description: '味が染み込みすぎる前に子供用に取り分ける', targetDislikedIngredients: [] },
      { type: '形状変化', description: '大根を小さめの乱切りにして、食べやすくする', targetDislikedIngredients: ['大根'] }
    ]
  },
  {
    id: 'm8',
    name: 'たっぷりキノコと豚肉のオイスター炒め',
    ingredients: [
      { name: '豚バラ薄切り肉', amount: '200g' },
      { name: 'しめじ', amount: '1パック' },
      { name: 'えのき', amount: '1袋' },
      { name: 'ピーマン', amount: '2個' },
      { name: 'オイスターソース', amount: '大さじ2' },
      { name: '醤油', amount: '小さじ1' },
      { name: '酒', amount: '大さじ1' }
    ],
    steps: [
      'ピーマンは細切り、しめじとえのきは石づきを取ってほぐします。豚肉は5cm幅に切ります。',
      'フライパンにごま油を熱し、豚肉を炒めます。',
      '豚肉の色が変わったら、きのこ類とピーマンを加えてしんなりするまで炒めます。',
      'オイスターソース、醤油、酒を加えて手早く全体に絡めます。',
      '味が馴染んだら火を止め、お皿に盛ります。'
    ],
    cookingTime: 10,
    appliance: ['フライパン'],
    tags: ['肉', '野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: 'きのこをみじん切りにして存在感を消す', targetDislikedIngredients: ['きのこ', 'しめじ', 'えのき'] },
      { type: '味変', description: 'オイスターソースの代わりに、甘口の焼肉のタレで味付けする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm9',
    name: '野菜の水分だけで作る無水肉じゃが',
    ingredients: [
      { name: '豚こま切れ肉', amount: '200g' },
      { name: 'じゃがいも', amount: '3個' },
      { name: 'にんじん', amount: '1本' },
      { name: '玉ねぎ', amount: '1個' },
      { name: '醤油', amount: '大さじ3' },
      { name: 'みりん', amount: '大さじ2' },
      { name: '砂糖', amount: '大さじ2' }
    ],
    steps: [
      'じゃがいもは皮をむいて一口大に切り、にんじんは乱切り、玉ねぎはくし切りにします。',
      'ホットクックの内鍋に玉ねぎ、にんじん、じゃがいも、豚肉の順に入れます。（水は入れません）',
      '醤油、みりん、砂糖を全体に回しかけます。',
      '「肉じゃが」メニューを選んで加熱をスタートします。',
      '完成したら、全体に味が馴染むように底から優しくかき混ぜます。'
    ],
    cookingTime: 10,
    appliance: ['ホットクック'],
    tags: ['子供向け', '肉', '野菜'],
    branchOptions: [
      { type: '形状変化', description: 'じゃがいもをマッシュして、甘めのポテトサラダ風にする', targetDislikedIngredients: ['じゃがいも'] },
      { type: '形状変化', description: 'にんじんをすりおろして、野菜の形をなくす', targetDislikedIngredients: ['にんじん'] }
    ]
  },
  {
    id: 'm10',
    name: 'ヘルシオで焼くだけ！塩鯖と野菜のグリル',
    ingredients: [
      { name: '塩サバの半身', amount: '2枚' },
      { name: 'パプリカ（赤・黄）', amount: '各1/2個' },
      { name: 'アスパラガス', amount: '4本' },
      { name: 'オリーブオイル', amount: '小さじ2' },
      { name: 'レモン', amount: '1/4個' }
    ],
    steps: [
      'パプリカは乱切り、アスパラは根元の固い部分を落として3等分に切ります。',
      '切った野菜をボウルに入れ、オリーブオイルを絡めます。',
      'ヘルシオの角皿に網をのせ、塩サバと野菜を並べます。',
      '「塩ざけ・塩さば」メニュー、または「まかせて焼き」でオーブン加熱をスタートします。',
      '焼き上がったらお皿に盛り、お好みでレモンを絞ります。'
    ],
    cookingTime: 5,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['魚', '野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: 'サバの骨を抜いてほぐし、ごはんに混ぜておにぎりにする', targetDislikedIngredients: ['魚'] },
      { type: '味変', description: '野菜にチーズを乗せて焼いて、子供が食べやすい味にする', targetDislikedIngredients: ['パプリカ', 'アスパラガス'] }
    ]
  },
  {
    id: 'm11',
    name: '鶏むね肉のやわらかチキン南蛮',
    ingredients: [
      { name: '鶏むね肉', amount: '300g' },
      { name: '卵', amount: '1個' },
      { name: '小麦粉', amount: '大さじ2' },
      { name: '醤油', amount: '大さじ2' },
      { name: '酢', amount: '大さじ2' },
      { name: '砂糖', amount: '大さじ2' },
      { name: 'タルタルソース', amount: 'お好みで' }
    ],
    steps: [
      '鶏むね肉は一口大のそぎ切りにして小麦粉をまぶし、溶き卵をくぐらせます。',
      'フライパンに油を多めに熱し、鶏肉を揚げ焼きにします。',
      '醤油、酢、砂糖を合わせた甘酢ダレを別の小鍋で一煮立ちさせます。',
      '揚げ焼きにした鶏肉を甘酢ダレにサッと絡めます。',
      'お皿に盛り付け、タルタルソースをたっぷりかけます。'
    ],
    cookingTime: 15,
    appliance: ['フライパン', '鍋'],
    tags: ['肉', '子供向け'],
    branchOptions: [
      { type: '味変', description: '酸味が苦手な子供用に、甘酢ダレをかけずマヨネーズのみにする', targetDislikedIngredients: ['酢', '酸味'] },
      { type: '形状変化', description: '小さく切ってナゲットのようにする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm12',
    name: '豚肉とキャベツのホイコーロー風',
    ingredients: [
      { name: '豚バラ肉', amount: '200g' },
      { name: 'キャベツ', amount: '1/4玉' },
      { name: 'ピーマン', amount: '2個' },
      { name: '甜麺醤（または味噌）', amount: '大さじ1' },
      { name: '醤油', amount: '小さじ1' },
      { name: '砂糖', amount: '小さじ1' }
    ],
    steps: [
      'キャベツはざく切り、ピーマンは乱切り、豚肉は5cm幅に切ります。',
      'フライパンに油を熱し、豚肉を炒めます。',
      '肉の色が変わったら、キャベツとピーマンを加えて強火で手早く炒めます。',
      '甜麺醤、醤油、砂糖を合わせておき、フライパンに回し入れます。',
      '全体に味が絡んだら完成です。'
    ],
    cookingTime: 10,
    appliance: ['フライパン'],
    tags: ['肉', '野菜', '時短'],
    branchOptions: [
      { type: '味変', description: '甜麺醤を使わず、焼肉のタレで子供向けの味にする', targetDislikedIngredients: ['味噌', '甜麺醤'] },
      { type: '形状変化', description: 'ピーマンを極小のみじん切りにして見えなくする', targetDislikedIngredients: ['ピーマン'] }
    ]
  },
  {
    id: 'm13',
    name: '鮭ときのこのクリームシチュー',
    ingredients: [
      { name: '生鮭', amount: '2切れ' },
      { name: '玉ねぎ', amount: '1個' },
      { name: 'にんじん', amount: '1/2本' },
      { name: 'しめじ', amount: '1/2パック' },
      { name: '牛乳', amount: '400ml' },
      { name: 'シチュールー', amount: '1/2箱' }
    ],
    steps: [
      '鮭は一口大に切り、骨があれば取り除きます。玉ねぎ、にんじんは一口大に切り、しめじはほぐします。',
      '鍋に油を熱し、玉ねぎ、にんじん、しめじを炒めます。',
      '水を200ml加えて煮込み、野菜が柔らかくなったら鮭を加えます。',
      '鮭に火が通ったら火を止め、ルーを割り入れて溶かします。',
      '牛乳を加えて弱火でとろみがつくまで煮込みます。'
    ],
    cookingTime: 15,
    appliance: ['鍋'],
    tags: ['魚', '子供向け', '野菜'],
    branchOptions: [
      { type: '形状変化', description: '鮭をほぐしてクリームソースに完全に混ぜ込む', targetDislikedIngredients: ['魚'] },
      { type: '取り分け', description: 'ルーを入れる前の野菜スープを大人の別メニューベースに取り分ける', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm14',
    name: 'ホットクックでお手軽ナポリタン',
    ingredients: [
      { name: 'パスタ（乾麺）', amount: '200g' },
      { name: '玉ねぎ', amount: '1/2個' },
      { name: 'ピーマン', amount: '1個' },
      { name: 'ウインナー', amount: '4本' },
      { name: 'ケチャップ', amount: '大さじ6' },
      { name: '水', amount: '250ml' },
      { name: 'オリーブオイル', amount: '大さじ1' }
    ],
    steps: [
      '玉ねぎは薄切り、ピーマンは細切り、ウインナーは斜め切りにします。',
      'パスタは半分に折ってホットクックの内鍋に入れます。',
      'その上に玉ねぎ、ピーマン、ウインナーをのせ、水、オリーブオイル、ケチャップを加えます。',
      '「ナポリタン」メニューを選んでスタートします。',
      '完成したらすぐにフタを開け、全体をよくかき混ぜてパスタをほぐします。'
    ],
    cookingTime: 5,
    appliance: ['ホットクック'],
    tags: ['子供向け', '時短'],
    branchOptions: [
      { type: '形状変化', description: 'ピーマンをみじん切りにする', targetDislikedIngredients: ['ピーマン'] },
      { type: '味変', description: '粉チーズをたっぷりかけて酸味をマイルドにする', targetDislikedIngredients: ['ケチャップ', '酸味'] }
    ]
  },
  {
    id: 'm15',
    name: 'ヘルシオでジューシーハンバーグ',
    ingredients: [
      { name: '合いびき肉', amount: '300g' },
      { name: '玉ねぎ', amount: '1/2個' },
      { name: 'パン粉', amount: '大さじ3' },
      { name: '牛乳', amount: '大さじ3' },
      { name: '塩こしょう', amount: '少々' }
    ],
    steps: [
      '玉ねぎはみじん切りにし、ヘルシオのレンジ機能で2分加熱して冷まします。',
      'ボウルにすべての材料を入れて粘りが出るまでこね、小判型に成形します。',
      '角皿にクッキングシートを敷き、ハンバーグを並べます。',
      '「まかせて焼き」またはハンバーグメニューでオーブン加熱します。',
      '焼き上がったら、お好みのソース（ケチャップなど）をかけます。'
    ],
    cookingTime: 10,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['肉', '子供向け'],
    branchOptions: [
      { type: '取り分け', description: '小さく成形して焼く', targetDislikedIngredients: [] },
      { type: '味変', description: 'チーズをのせて焼く', targetDislikedIngredients: [] }
    ]
  },

  // ---------------- 副菜（サイドディッシュ）15品 ----------------
  {
    id: 's1',
    name: 'レンジで3分！小松菜とツナの無限和え',
    ingredients: [
      { name: '小松菜', amount: '1束' },
      { name: 'ツナ缶', amount: '1缶' },
      { name: 'ごま油', amount: '大さじ1' },
      { name: '鶏ガラスープの素', amount: '小さじ1' },
      { name: '塩', amount: '少々' }
    ],
    steps: [
      '小松菜は根元を切り落とし、3cm幅に切って耐熱ボウルに入れます。',
      'ふんわりラップをしてヘルシオ（レンジ機能）で3分加熱します。',
      '加熱後、水気をしっかりと絞ります。',
      '軽く油を切ったツナ缶、ごま油、鶏ガラスープの素、塩を加えてよく和えます。',
      '冷蔵庫で少し冷やすと味が馴染んで美味しくなります。'
    ],
    cookingTime: 5,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['野菜', '時短'],
    branchOptions: [
      { type: '味変', description: 'マヨネーズを加えて、ツナマヨ味に変更する', targetDislikedIngredients: ['小松菜'] },
      { type: '形状変化', description: '細かく刻んで、ご飯や卵焼きに混ぜる', targetDislikedIngredients: ['小松菜'] }
    ]
  },
  {
    id: 's2',
    name: 'ホクホクかぼちゃのそぼろあんかけ',
    ingredients: [
      { name: 'かぼちゃ', amount: '1/4個' },
      { name: '豚ひき肉', amount: '100g' },
      { name: '水', amount: '150ml' },
      { name: '醤油', amount: '大さじ1.5' },
      { name: 'みりん', amount: '大さじ1' },
      { name: '砂糖', amount: '大さじ1' },
      { name: '水溶き片栗粉', amount: '適量' }
    ],
    steps: [
      'かぼちゃは種とワタを取り、一口大に切ります。',
      '鍋に油を熱し、豚ひき肉をポロポロになるまで炒めます。',
      'かぼちゃ、水、調味料をすべて入れ、フタをして中火で10分煮ます。',
      'かぼちゃが柔らかくなったら、一度火を止めて水溶き片栗粉を回し入れます。',
      '再び火をつけて混ぜながらとろみをつけます。'
    ],
    cookingTime: 10,
    appliance: ['鍋'],
    tags: ['子供向け', '野菜'],
    branchOptions: [
      { type: '形状変化', description: 'かぼちゃを潰して丸め、あんをかけてコロッケ風にする', targetDislikedIngredients: ['かぼちゃ'] },
      { type: '取り分け', description: 'あんをかける前に、味付けの薄いかぼちゃを取り分ける', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's3',
    name: 'やみつき！たたききゅうりの塩昆布和え',
    ingredients: [
      { name: 'きゅうり', amount: '2本' },
      { name: '塩昆布', amount: '大さじ2' },
      { name: 'ごま油', amount: '大さじ1' },
      { name: '白ごま', amount: '適量' }
    ],
    steps: [
      'きゅうりは麺棒などで叩いてひびを入れ、手で一口大に割ります。（味が染みやすくなります）',
      'ポリ袋にきゅうり、塩昆布、ごま油を入れます。',
      '袋の外からよく揉み込み、冷蔵庫で10分ほど置きます。',
      'お皿に盛り付け、白ごまを振って完成です。'
    ],
    cookingTime: 5,
    appliance: ['フライパン'], // ※火は使わないが分類上指定
    tags: ['野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: '薄い輪切りにして塩もみし、食感を変える', targetDislikedIngredients: ['きゅうり'] },
      { type: '味変', description: '少しツナマヨネーズを足してマイルドにする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's4',
    name: 'ふわふわ卵とトマトの中華炒め',
    ingredients: [
      { name: 'トマト', amount: '2個' },
      { name: '卵', amount: '3個' },
      { name: '鶏ガラスープの素', amount: '小さじ1' },
      { name: 'ごま油', amount: '大さじ1' }
    ],
    steps: [
      'トマトはくし切りにし、卵はボウルに割って鶏ガラスープの素を加えてよく溶いておきます。',
      'フライパンにごま油を熱し、強火で溶き卵を一気に流し入れます。',
      '大きくかき混ぜて半熟になったら一度お皿に取り出します。',
      '同じフライパンでトマトを炒め、少し崩れてきたら卵を戻します。',
      'サッと混ぜ合わせて火から下ろします。'
    ],
    cookingTime: 5,
    appliance: ['フライパン'],
    tags: ['時短', '野菜'],
    branchOptions: [
      { type: '味変', description: 'ケチャップを追加して、子供向けの洋風の味付けにする', targetDislikedIngredients: ['トマト'] },
      { type: '取り分け', description: 'トマトを入れる前に、味付きの卵だけを取り分ける', targetDislikedIngredients: ['トマト'] }
    ]
  },
  {
    id: 's5',
    name: '電子レンジで作る、なすの煮浸し風',
    ingredients: [
      { name: 'なす', amount: '3本' },
      { name: 'めんつゆ（3倍濃縮）', amount: '大さじ3' },
      { name: '水', amount: '大さじ3' },
      { name: 'ごま油', amount: '大さじ1' },
      { name: 'すりおろし生姜', amount: '少々' }
    ],
    steps: [
      'なすはヘタを取り、縦半分に切ってから皮目に斜めの切り込みを入れ、一口大に切ります。',
      '耐熱ボウルになすを入れ、ごま油を回しかけて全体にコーティングします。',
      'めんつゆ、水、生姜を加えて軽く混ぜ、ふんわりラップをします。',
      'ヘルシオ（レンジ機能）で4〜5分、なすがトロトロになるまで加熱します。',
      '粗熱を取り、味が染み込むまで少し待ちます。'
    ],
    cookingTime: 5,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: '皮を完全にむいてから加熱し、なす特有の皮の食感をなくす', targetDislikedIngredients: ['なす'] },
      { type: '味変', description: 'めんつゆの代わりにポン酢にしてさっぱりさせる', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's6',
    name: '子供が喜ぶ！マカロニサラダ',
    ingredients: [
      { name: 'マカロニ', amount: '50g' },
      { name: 'きゅうり', amount: '1/2本' },
      { name: 'ハム', amount: '3枚' },
      { name: 'ゆで卵', amount: '1個' },
      { name: 'マヨネーズ', amount: '大さじ3' },
      { name: '塩こしょう', amount: '少々' }
    ],
    steps: [
      'マカロニは鍋で表示通りに茹でてザルに上げ、冷水で冷まして水気をしっかり切ります。',
      'きゅうりは薄い輪切りにして軽く塩揉みし、ハムは短冊切りにします。',
      'ボウルに茹でたマカロニ、水気を絞ったきゅうり、ハム、粗く潰したゆで卵を入れます。',
      'マヨネーズと塩こしょうを加えて全体をよく和えます。',
      '器に盛り付けます。'
    ],
    cookingTime: 15,
    appliance: ['鍋'],
    tags: ['子供向け', '野菜'],
    branchOptions: [
      { type: '形状変化', description: 'きゅうりとハムを極小のみじん切りにして存在感を消す', targetDislikedIngredients: ['きゅうり'] },
      { type: '取り分け', description: 'マヨネーズで和える前に、茹でたマカロニだけを取り分ける', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's7',
    name: 'にんじんとしりしり（ツナ入り）',
    ingredients: [
      { name: 'にんじん', amount: '1本' },
      { name: 'ツナ缶', amount: '1缶' },
      { name: '卵', amount: '1個' },
      { name: 'めんつゆ', amount: '大さじ1' },
      { name: 'ごま油', amount: '小さじ1' }
    ],
    steps: [
      'にんじんはスライサーか包丁で細い千切りにします。',
      'フライパンにごま油を熱し、にんじんを炒めます。',
      'にんじんがしんなりしたら、軽く油を切ったツナ缶とめんつゆを加えます。',
      '全体が混ざったら、溶き卵を回し入れます。',
      '卵がポロポロになるまでかき混ぜながら炒めたら完成です。'
    ],
    cookingTime: 10,
    appliance: ['フライパン'],
    tags: ['子供向け', '野菜'],
    branchOptions: [
      { type: '形状変化', description: 'さらに細かくみじん切りにして、ふりかけ状にする', targetDislikedIngredients: ['にんじん'] },
      { type: '味変', description: '少し砂糖を加えて、卵焼きのような甘い味付けにする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's8',
    name: 'レンジで簡単！きのこのバターぽん酢',
    ingredients: [
      { name: 'しめじ', amount: '1パック' },
      { name: 'エリンギ', amount: '1パック' },
      { name: 'バター', amount: '15g' },
      { name: 'ポン酢', amount: '大さじ2' },
      { name: '青ねぎ', amount: '適量' }
    ],
    steps: [
      'しめじは石づきを取ってほぐし、エリンギは長さを半分にして薄切りにします。',
      '耐熱ボウルにきのこを入れ、上にバターをのせます。',
      'ふんわりラップをしてヘルシオ（レンジ機能）で3分加熱します。',
      '熱いうちにポン酢を加えて全体をよく混ぜ合わせます。',
      'お皿に盛り、小口切りにした青ねぎを散らします。'
    ],
    cookingTime: 5,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: 'きのこをみじん切りにして、バターライスに混ぜ込む', targetDislikedIngredients: ['きのこ', 'しめじ'] },
      { type: '味変', description: 'ポン酢ではなく醤油とマヨネーズに変更する', targetDislikedIngredients: ['ポン酢', '酸味'] }
    ]
  },
  {
    id: 's9',
    name: 'シャキシャキもやしナムル',
    ingredients: [
      { name: 'もやし', amount: '1袋' },
      { name: 'ごま油', amount: '大さじ1' },
      { name: '鶏ガラスープの素', amount: '小さじ1' },
      { name: 'すりおろしニンニク', amount: '少々' },
      { name: '白ごま', amount: '大さじ1' }
    ],
    steps: [
      'もやしは耐熱ボウルに入れ、ラップをしてヘルシオ（レンジ機能）で2分半加熱します。',
      '加熱後、水気をしっかりと絞ります（ここでしっかり絞るのがポイントです）。',
      'ボウルにごま油、鶏ガラスープの素、ニンニク、白ごまを入れて混ぜます。',
      '水気を切ったもやしを加えて和えます。',
      '冷蔵庫で冷やすと味がより馴染みます。'
    ],
    cookingTime: 5,
    appliance: ['ヘルシオ（オーブン/レンジ機能）'],
    tags: ['野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: 'もやしを細かく刻んでチヂミの具にする', targetDislikedIngredients: ['もやし'] },
      { type: '味変', description: 'ニンニクを抜き、少し醤油を足して和風の味にする', targetDislikedIngredients: ['ニンニク'] }
    ]
  },
  {
    id: 's10',
    name: '野菜たっぷりコンソメスープ',
    ingredients: [
      { name: 'キャベツ', amount: '1枚' },
      { name: '玉ねぎ', amount: '1/4個' },
      { name: 'にんじん', amount: '1/3本' },
      { name: 'ウインナー', amount: '2本' },
      { name: '水', amount: '400ml' },
      { name: 'コンソメキューブ', amount: '1個' }
    ],
    steps: [
      'キャベツ、玉ねぎ、にんじんはすべて粗めのみじん切りにします。ウインナーは輪切りにします。',
      '小鍋に水と切った具材をすべて入れ、中火にかけます。',
      '沸騰したらアクを取り、コンソメキューブを加えます。',
      '野菜が柔らかくなるまで弱火で5〜6分煮込みます。',
      '塩こしょうで味を調えて器に注ぎます。'
    ],
    cookingTime: 10,
    appliance: ['鍋'],
    tags: ['子供向け', '野菜'],
    branchOptions: [
      { type: '形状変化', description: 'ブレンダーにかけて、なめらかな野菜ポタージュにする', targetDislikedIngredients: ['キャベツ', '玉ねぎ', 'にんじん'] },
      { type: '取り分け', description: 'コンソメを入れる前に、煮た野菜だけを取り分ける', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's11',
    name: 'カリカリ！じゃがいものガレット',
    ingredients: [
      { name: 'じゃがいも', amount: '2個' },
      { name: '片栗粉', amount: '大さじ1' },
      { name: '塩こしょう', amount: '少々' },
      { name: 'サラダ油', amount: '大さじ1' },
      { name: 'ピザ用チーズ', amount: 'お好みで' }
    ],
    steps: [
      'じゃがいもは皮をむいて千切りにします（水にはさらしません）。',
      'ボウルにじゃがいも、片栗粉、塩こしょう、チーズを入れてよく混ぜます。',
      'フライパンに油を熱し、じゃがいもを平らに広げます。',
      'フタをして中火で5分焼き、裏返してさらに3分カリッと焼きます。',
      '食べやすい大きさに切って器に盛ります。'
    ],
    cookingTime: 15,
    appliance: ['フライパン'],
    tags: ['子供向け', '野菜'],
    branchOptions: [
      { type: '味変', description: 'ケチャップをつけて食べる', targetDislikedIngredients: [] },
      { type: '取り分け', description: 'チーズを入れずに焼く', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's12',
    name: 'ピーマンとちくわのきんぴら',
    ingredients: [
      { name: 'ピーマン', amount: '3個' },
      { name: 'ちくわ', amount: '2本' },
      { name: 'ごま油', amount: '大さじ1' },
      { name: '醤油', amount: '大さじ1' },
      { name: 'みりん', amount: '大さじ1' },
      { name: '白ごま', amount: '適量' }
    ],
    steps: [
      'ピーマンは細切りにし、ちくわは斜め薄切りにします。',
      'フライパンにごま油を熱し、ピーマンとちくわを炒めます。',
      'ピーマンが少ししんなりしたら、醤油とみりんを加えます。',
      '汁気がなくなるまで炒め合わせ、最後に白ごまを振ります。'
    ],
    cookingTime: 10,
    appliance: ['フライパン'],
    tags: ['野菜', '時短'],
    branchOptions: [
      { type: '形状変化', description: 'みじん切りにしてチャーハンの具にする', targetDislikedIngredients: ['ピーマン'] },
      { type: '味変', description: 'マヨネーズで和えてマイルドにする', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's13',
    name: 'ホットクックでお手軽ポテトサラダ',
    ingredients: [
      { name: 'じゃがいも', amount: '3個' },
      { name: 'にんじん', amount: '1/3本' },
      { name: 'きゅうり', amount: '1/2本' },
      { name: 'ハム', amount: '3枚' },
      { name: 'マヨネーズ', amount: '大さじ3' },
      { name: '水', amount: '大さじ3' }
    ],
    steps: [
      'じゃがいもは皮をむいて一口大、にんじんはイチョウ切りにします。',
      'ホットクックの内鍋にじゃがいも、にんじん、水を入れ、「ポテトサラダ（ゆで〜つぶし）」メニューでスタートします。',
      'きゅうりは薄切りにして塩揉みし、ハムは短冊切りにします。',
      '加熱終了後、ホットクックの中でじゃがいもを潰します。',
      '粗熱が取れたら、きゅうり、ハム、マヨネーズを加えて和えます。'
    ],
    cookingTime: 10,
    appliance: ['ホットクック'],
    tags: ['子供向け', '野菜'],
    branchOptions: [
      { type: '形状変化', description: 'きゅうりを極小のみじん切りにする', targetDislikedIngredients: ['きゅうり'] },
      { type: '取り分け', description: 'マヨネーズを入れる前に潰したポテトだけ取り分ける', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's14',
    name: 'とうもろこしのバター醤油炒め',
    ingredients: [
      { name: 'とうもろこし（またはコーン缶）', amount: '1本（缶なら1缶）' },
      { name: 'バター', amount: '10g' },
      { name: '醤油', amount: '小さじ1' }
    ],
    steps: [
      '生のとうもろこしを使う場合は、包丁で実を削ぎ落とします。（缶詰の場合は水気を切る）',
      'フライパンにバターを熱し、とうもろこしを炒めます。',
      '少し焼き色がついたら、鍋肌から醤油を回し入れます。',
      '香ばしい香りが立ったらサッと混ぜて火を止めます。'
    ],
    cookingTime: 5,
    appliance: ['フライパン'],
    tags: ['子供向け', '時短'],
    branchOptions: [
      { type: '取り分け', description: '醤油を入れる前に取り分ける', targetDislikedIngredients: [] },
      { type: '味変', description: '青のりをかけて風味を変える', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 's15',
    name: '豆腐とわかめの味噌汁',
    ingredients: [
      { name: '豆腐', amount: '1/2丁' },
      { name: '乾燥わかめ', amount: '大さじ1' },
      { name: '水', amount: '400ml' },
      { name: '和風だしの素', amount: '小さじ1' },
      { name: '味噌', amount: '大さじ2' }
    ],
    steps: [
      '鍋に水と和風だしの素を入れて火にかけます。',
      '沸騰したら、さいの目に切った豆腐と乾燥わかめを加えます。',
      '一煮立ちしたら火を弱め、味噌を溶き入れます。',
      '沸騰する直前で火を止め、お椀に注ぎます。'
    ],
    cookingTime: 5,
    appliance: ['鍋'],
    tags: ['時短'],
    branchOptions: [
      { type: '取り分け', description: '味噌を薄めにして子供用に取り分ける', targetDislikedIngredients: [] },
      { type: '味変', description: 'ごま油を少し垂らして風味を変える', targetDislikedIngredients: [] }
    ]
  },
  {
    id: 'm16',
    name: 'ほろほろ牛すじ大根煮',
    ingredients: [
      { name: 'ボイル牛すじ肉', amount: '120g' },
      { name: '大根', amount: '1/3本(250g)' },
      { name: 'こんにゃく', amount: '1枚(250g)' },
      { name: 'しょうが', amount: '10g' },
      { name: '砂糖', amount: '大さじ3' },
      { name: '酒', amount: '大さじ3' },
      { name: 'みりん', amount: '大さじ3' },
      { name: 'しょうゆ', amount: '大さじ3' },
      { name: '刻みネギ・一味唐辛子等(あれば)', amount: '適量' }
    ],
    steps: [
      '生の牛すじ肉を使用する場合は沸騰したお鍋で茹でてから食べやすい大きさに切る。（ボイル済みの場合は切るだけ）',
      '大根は0.8cmの厚みに切り、こんにゃくは一口大にちぎる。生姜は千切りにする。',
      'ホットクックの内鍋に全ての材料と調味料（砂糖・酒・みりん・しょうゆ）を入れる。',
      'ホットクックで「カテゴリーで探す」→「煮物」→「肉」→「牛すじの煮こみ」を選び、スタートする。',
      '90分後に出来上がったら器に盛り付け、お好みでネギや一味唐辛子をかけて完成。'
    ],
    cookingTime: 15,
    appliance: ['ホットクック', '鍋'],
    tags: ['肉', '煮物', '和食'],
    branchOptions: []
  },
  {
    id: 'm17',
    name: 'トマト煮込みハンバーグ',
    ingredients: [
      { name: '合いびき肉', amount: '500g' },
      { name: '玉ねぎ', amount: '1/2個(100g)' },
      { name: '塩', amount: '小さじ1/2' },
      { name: 'こしょう', amount: '適量' },
      { name: '卵', amount: '1個' },
      { name: 'パン粉', amount: '大さじ3' },
      { name: '牛乳', amount: '大さじ1' },
      { name: 'トマトジュース', amount: '1缶(190g)' },
      { name: '砂糖', amount: '小さじ1' },
      { name: 'コンソメ', amount: '小さじ1' },
      { name: 'ケチャップ', amount: '大さじ3' },
      { name: 'ウスターソース', amount: '大さじ1' }
    ],
    steps: [
      '玉ねぎはみじん切りにする。ボウルに玉ねぎ、合いびき肉、塩、こしょう、卵、パン粉、牛乳を全て混ぜ合わせ、小判型に成形する。',
      'ホットクックの内鍋に成形したハンバーグをなるべく重ならないように並べる。',
      'トマトジュース、砂糖、コンソメ、ケチャップ、ウスターソースを全て加える。',
      'ホットクックで「手動で作る」→「煮物を作る」→「まぜない」→「10分」を選び、スタートする。',
      '約24分後、出来上がったら器に盛り付けて完成！お好みでチーズをのせてトースターで焼いても美味しいです。'
    ],
    cookingTime: 15,
    appliance: ['ホットクック'],
    tags: ['肉', 'メイン', '子供向け', '洋食'],
    branchOptions: []
  },
  {
    id: 'm18',
    name: '塩だけで美味しいシチュー',
    ingredients: [
      { name: '鶏もも肉(一口大)', amount: '1枚(300g)' },
      { name: '玉ねぎ', amount: '2個(400g)' },
      { name: '人参', amount: '1/2本(60g)' },
      { name: 'じゃがいも', amount: '3個(約270g)' },
      { name: 'しめじ', amount: '30g' },
      { name: '米粉(または小麦粉)', amount: '大さじ3' },
      { name: '水', amount: '200ml' },
      { name: '塩', amount: '総重量の0.6% (約8g)' },
      { name: '牛乳', amount: '200ml' }
    ],
    steps: [
      'スケールの上に内鍋を乗せ、メモリをゼロにする。鶏もも肉、薄切りにした玉ねぎ、乱切りにした人参、大きめに切ったじゃがいも、しめじを入れる。',
      '米粉を入れて、一度スケールからおろして底からしっかり混ぜる。再びスケールにのせて水200mlを加える。',
      '仕上げの牛乳200mlを足した（実際はまだ入れない）総重量の0.6%の塩を入れる。',
      'ホットクックで「カテゴリーで探す」→「カレー・シチュー」→「クリームシチュー」を選び、スタートする（予約可能）。',
      '残り時間が3分になれば通知音が鳴るので、牛乳を加えて再スタートする。約48分後に完成！'
    ],
    cookingTime: 15,
    appliance: ['ホットクック'],
    tags: ['肉', 'メイン', '煮物', '子供向け', '洋食'],
    branchOptions: []
  }
];
