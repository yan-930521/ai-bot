module.exports = class NN {
    // init : 初始化網路架構
    init(ni, nh, no) {
        // input hidden ouput 的長度宣告
        this.ni = ni + 1;
        this.nh = nh;
        this.no = no;
        
        // 建立各層的陣列
        this.ai = this.makeArray(this.ni, 1);
        this.ah = this.makeArray(this.nh, 1);
        this.ao = this.makeArray(this.no, 1);

        // 建立權重陣列
        this.wi = this.makeMatrix(this.ni, this.nh, 0);
        this.wo = this.makeMatrix(this.nh, this.no, 0);
        
        for (let i = 0 ; i < this.ni ; i++)
            for (let j = 0 ; j < this.nh ; j++)
                this.wi[i][j] = this.random(-0.2, 0.2);

        for (let i = 0 ; i < this.nh ; i++)
            for (let j = 0 ; j < this.no ; j++)
                this.wo[i][j] = this.random(-0.2, 0.2);
        
        // 上一次的改變量
        this.ci = this.makeMatrix(this.ni, this.nh, 0);
        this.co = this.makeMatrix(this.nh, this.no, 0);
    }

    train(patterns, iterations, rate, moment) {
        // 輸入 , 迭代次數 , 學習率 , XXX
        for (let i = 0 ; i < iterations ; i++) {

            // 初始化誤差
            let error = 0;

            // 遍歷所有測資
            for ( let p in patterns) {

                // pat : 每筆資料
                let pat = patterns[p];

                // inputs : 輸入
                let inputs = pat[0];

                // targets : 期望輸出
                let targets = pat[1];
                
                // outputs : 預測輸出
                let outputs = this.update(inputs);
                // 註. updata會直接改動this.ai, this.ah, this.ao

                // 加總誤差
                error = error + this.backPropagate(targets, rate, moment);
            }

            if (i%100 == 0) {
                // 輸出總誤差
                console.log(`${i} : error=> ${error}`)
            }

        }
    }

    // 將 inputs 輸入進 this.ai, this.ah, this.ao, 並計算輸出值
    update(inputs) {

        // 設定輸入
        for (let i = 0 ; i < this.ni-1 ; i++)
            this.ai[i] = inputs[i];
        
        // 計算點積
        for (let j = 0 ; j < this.nh ; j++) {
            let sum = 0;
            for (let i = 0 ; i < this.ni ; i++)
              sum += this.ai[i] * this.wi[i][j];

            // 真正的數字要經過 sigmoid 處理
            this.ah[j] = this.sigmoid(sum, "tanh");
        }

        //計算輸出
        for (let k = 0 ; k < this.no ; k++) {
            let sum = 0;
            for (let j = 0 ; j < this.nh ; j++)
                sum += this.ah[j] * this.wo[j][k];
            
            // 真正的數字要經過 sigmoid 處理
            this.ao[k] = this.sigmoid(sum, "tanh");
        }

        return this.ao;
    }

    // 反向傳播
    backPropagate(targets, rate, moment) {

        // 計算輸出層誤差
        let output_deltas = this.makeArray(this.no, 0);
        for (let k = 0; k < this.no ; k++) {
            let error = targets[k]-this.ao[k];
            output_deltas[k] = this.dsigmoid(this.ao[k], "tanh") * error;
        }

        // 計算隱藏層誤差
        let hidden_deltas = this.makeArray(this.nh, 0);
        for (let j = 0 ; j < this.nh ; j++) {
            let error = 0;
            for (let k = 0 ; k < this.no ; k++) {
                error += output_deltas[k] * this.wo[j][k];
            }
            hidden_deltas[j] = this.dsigmoid(this.ah[j], "tanh") * error;
        }

        // 更新輸出層權重
        for (let j = 0 ; j < this.nh ; j++) {
            for (let k = 0 ; k < this.no ; k++) {
              let change = output_deltas[k] * this.ah[j];
              // 學習率 * 誤差值 + 動量常數 * 上次的改變量
              this.wo[j][k] = this.wo[j][k] + rate * change + moment * this.co[j][k];
              this.co[j][k] = change;
            }
        }

        // 更新輸入層權重
        for (let i = 0 ; i < this.ni ; i++) {
            for (let j = 0 ; j < this.nh ; j++) {
              let change = hidden_deltas[j] * this.ai[i];
              // 學習率 * 誤差值 + 動量常數 * 上次的改變量
              this.wi[i][j] = this.wi[i][j] + rate * change + moment * this.ci[i][j];
              this.ci[i][j] = change;
            }
        }

        // 計算輸出層誤差總合
        let error = 0;
        for (let k = 0 ; k < this.no ; k++)
            error += Math.pow(targets[k]-this.ao[k], 2) * 0.5;
        return error;
    }

    // 觀察學習結果是否都正確
    test(pat) {
      return this.numbersToStr(this.update(pat), 0);
    }

    makeArray(n, fill) {
        let a = [];
        for(let i = 0 ; i < n ; i++) {
            a.push(fill);
        }
        return a;
    }

    makeMatrix(i, j, fill) {
        let a = [];
        for(let n = 0 ; n < i ; n++) {
            a.push(this.makeArray(j, fill));
        }
        return a;
    }

    random(a, b) {
        return (b - a) * Math.random() + a;
    }

    numbersToStr(array, precision) {
        let str = "";
        for (let i = 0 ; i< array.length ; i++) {
            if (array[i]>=0)
                str += ` ${array[i].toFixed(precision)} `;
            else
                str += `${array[i].toFixed(precision)} `;
        }
        return str;
    }

    sigmoid(a, type) {
        switch(type) {
            case "tanh":
                // 雙曲正切函數
                return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));

            default:
                // 雙曲正切函數
                return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a));
        }
    }

    // sigmoid 的微分式
    dsigmoid(a, type) {
        switch(type) {
            case "tanh":
                // 雙曲正切函數
                return 1 - a*a;

            default:
                // 雙曲正切函數
                return 1 - a*a;
        }
    }
}