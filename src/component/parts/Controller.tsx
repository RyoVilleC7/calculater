//React
import * as React from 'react';

//Redux
import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { AppState } from '../../store/store';

//Outside Components
import Button from './button';

/////////////////////////////////////////////////////////////////

type stateByProps = {
    startState: boolean;
    lifeCycleState: boolean;
    operatorState: boolean;
    floatState: boolean;
    formulaState: string;
    dis_numState: string;
};

type dispatchByProps = {
    start: (arg: boolean) => void;
    lifeCycle: (arg: boolean) => void;
    operator: (arg: boolean) => void;
    float: (arg: boolean) => void;
    formula: (arg: string) => void;
    dis_num: (arg: string) => void;
};

type Props = stateByProps & dispatchByProps;


//内部データ処理用の変数-----------------------------------------------
let mathArray: string[] = [];   //数式を格納
let preserve: string = '';    //前回の値を保存
let f_preserve: string = '';     //数式を保持
let result: string = '';    //結合した配列を格納
let lengthCheck: number = 0;    //桁数チェック用の補助変数


//Component
const Controller: React.FC<Props> = (props) => {
  

    //numbers------------------------------------------------------
    const addNum = function(n: string): void{

        //preserve内の数値が9桁以上の場合は入力禁止
        if(!(lengthCheck >= 9)){

        //計算開始の判定
        if(props.lifeCycleState){
      
          //符号保有しているか判定
            if(props.operatorState){

                //小数点が入力された場合
                if(n === '.'){
                    
                    mathArray.push(preserve); //値を保存
                    preserve = ''; //前回の値を初期化
                    f_preserve = '';
                    
                    for (let i = 0; i < mathArray.length; i++) {
                        f_preserve += mathArray[i];
                    }

                    preserve = Number(preserve).toLocaleString() + n;

                    props.dis_num(preserve);
                    props.formula(f_preserve + preserve);
                    props.operator(false);

                }else {
                    //小数点以外が入力された場合

                    mathArray.push(preserve); //値を保存
                    preserve = ''; //前回の値を初期化
                    f_preserve = '';
                    
                    for (let i = 0; i < mathArray.length; i++) {
                        f_preserve += mathArray[i];
                    }

                    preserve += n;

                    props.dis_num(Number(preserve).toLocaleString());
                    props.formula(f_preserve + Number(preserve).toLocaleString());
                    props.operator(false);
                }

            } else {

                //小数点が入力された場合
                if(n === '.'){

                    //小数点が入力済みかチェック
                    if(preserve.indexOf('.') === -1){

                        preserve = Number(preserve.replace(/,/g, "")).toLocaleString() + '.';

                        props.dis_num(preserve);
                        props.formula(f_preserve + preserve);
                        props.float(true);
                    }
                    
                }else {
                    
                    //小数点入力後に"0"が入力された場合
                    if(n === '0' && props.floatState){

                        preserve = Number(preserve.replace(/,/g, "")).toLocaleString() + '.0';

                        props.dis_num(preserve);
                        props.formula(f_preserve + preserve);
                        props.float(false);
                    
                    }else {

                        preserve += n;

                        lengthCheck = preserve.toString().length;
        
                        props.dis_num(Number(preserve.replace(/,/g, "")).toLocaleString());
                        props.formula(f_preserve + Number(preserve.replace(/,/g, "")).toLocaleString());
                        props.float(false);
                    }

                }
            }

        } else {

            if(props.operatorState){

                preserve += n;
                
                //状態変更
                props.start(true);
                props.lifeCycle(true);
                props.operator(false);
                props.dis_num(Number(preserve).toLocaleString());
                props.formula(preserve);

            }else {

                if(n === '.'){

                    //初期化
                    preserve = '';
                    mathArray = [];
                    f_preserve = '';
                    result = '';

                    preserve = Number(preserve).toLocaleString() + n;
                    
                    //状態変更
                    props.start(true);
                    props.lifeCycle(true);
                    props.dis_num(preserve);
                    props.formula(preserve);

                }else {
                    
                    //初期化
                    preserve = '';
                    mathArray = [];
                    f_preserve = '';
                    result = '';

                    preserve += n;

                    //状態変更
                    props.start(true);
                    props.lifeCycle(true);
                    props.dis_num(Number(preserve).toLocaleString());
                    props.formula(preserve);
                }
            }
        };
        }
      };
  

    //operator-----------------------------------------------------
    const operator = function(o: string): void{

        if(props.lifeCycleState){

            if(!props.operatorState){

                //演算子入力時の処理
                mathArray.push(Number(preserve.replace(/,/g, "")).toLocaleString()); //値を保存
                preserve = o;
                f_preserve = '';
                lengthCheck = 0;
                
                for (let i = 0; i < mathArray.length; i++) {
                    f_preserve += mathArray[i];
                }

                //状態変更
                props.operator(true);
                props.formula(f_preserve + o);

            }else {

                //演算子の次に演算子が入力された際の処理
                f_preserve = '';
                lengthCheck = 0;
                
                for (let i = 0; i < mathArray.length; i++) {
                    f_preserve += mathArray[i];
                }

                preserve = o;

                //状態変更
                props.operator(true);
                props.formula(f_preserve + o);
            }

        }else {

            if(!props.startState){

                if(o === '-'){

                    preserve = o;

                    //状態変更
                    props.start(true);
                    props.lifeCycle(true);
                    props.operator(true);
                    props.formula(preserve);
                }
                
            }else {

                mathArray = [];
                preserve = o;

                //状態変更
                mathArray.push(Number(eval(result.replace(/,/g, ""))).toLocaleString());
                props.dis_num(Number(eval(result.replace(/,/g, ""))).toLocaleString());
                props.formula(Number(eval(result.replace(/,/g, ""))).toLocaleString() + preserve);
                props.operator(true);
                props.lifeCycle(true);
            }
        }
    };
  
  
    //equal--------------------------------------------------------
    const equal = function(): void{

            if(props.lifeCycleState){

                if(!props.operatorState){

                    //配列に式を代入
                    mathArray.push(Number(preserve.replace(/,/g, "")).toLocaleString());
                    preserve = '';

                    //dis_numに代入
                    result = '';
                    mathArray = mathArray.map((value) => {
                        switch (value) {
                          //mathArray内の符号はそのままリターン
                          case '+':
                          case '-':
                          case '*':
                          case '/':
                            return value;
                      
                          //mathArray内の数値はカンマを除去
                          default:
                            return value.replace(/,/g, "");
                        }
                    });
                
                    for (let i = 0; i < mathArray.length; i++) {
                        result += mathArray[i];
                    }

                    //計算結果が10桁以上の場合、指数換算する
                    lengthCheck = eval(result)
                    if(lengthCheck.toString().length >= 10){
                        props.dis_num(Number(eval(result)).toExponential());
                    }else {
                        props.dis_num(Number(eval(result)).toLocaleString());
                    }

                    //fomulaに代入
                    result = '';
                    mathArray = mathArray.map((value) => {
                        switch (value) {
                          //mathArray内の符号はそのままリターン
                          case '+':
                          case '-':
                          case '*':
                          case '/':
                            return value;
                      
                          //mathArray内の数値はカンマを付与
                          default:
                            return Number(value).toLocaleString();
                        }
                    });
                
                    for (let i = 0; i < mathArray.length; i++) {
                        result += mathArray[i];
                    }

                    //初期化
                    lengthCheck = 0;

                    //状態変更
                    props.lifeCycle(false);
                    props.formula(result + '=');

            }else {

                //配列に式を代入
                mathArray.push(preserve, mathArray[mathArray.length - 1]);
                preserve = ''

                //dis_numに代入
                result = '';
                mathArray = mathArray.map((value) => {
                    switch (value) {
                      //mathArray内の符号はそのままリターン
                      case '+':
                      case '-':
                      case '*':
                      case '/':
                        return value;
                  
                      //mathArray内の数値はカンマを除去
                      default:
                        return value.replace(/,/g, "");
                    }
                });

                  for (let i = 0; i < mathArray.length; i++){
                      result += mathArray[i];
                  }

                lengthCheck = eval(result)
                if(lengthCheck.toString().length >= 10){
                    props.dis_num(Number(eval(result)).toExponential());
                }else {
                    props.dis_num(Number(eval(result)).toLocaleString());
                }
                

                //fomulaに代入
                result = '';
                mathArray = mathArray.map((value) => {
                    switch (value) {
                      //mathArray内の符号はそのままリターン
                      case '+':
                      case '-':
                      case '*':
                      case '/':
                        return value;
                  
                      //mathArray内の数値はカンマを付与
                      default:
                        return Number(value).toLocaleString();
                    }
                });
            
                for (let i = 0; i < mathArray.length; i++) {
                    result += mathArray[i];
                }

                //初期化
                lengthCheck = 0;

                //状態変更
                props.lifeCycle(false);
                props.formula(result + '=');

            }
        }
    };
    
  
    //clear関数--------------------------------------------------------
    const clear = function(): void{

        //全ての変数と状態を初期化
        props.start(false);
        props.lifeCycle(false);
        props.operator(false);
        props.float(false);
        props.dis_num('0');
        props.formula('0');
        mathArray = [];
        preserve = '';
        result = '';
        f_preserve = '';
        lengthCheck = 0;
    };
    

    //button-------------------------------------------------------

    const btnData = ['7','8','9','4','5','6','1','2','3','0','.'];
    const operateViewData = ['÷','×','-','+'];
    const operateInternalData = ['/','*','-','+'];

    return (
        <div id="Controller">

            <div className="l_content">

                <div className="l_content_top">
                    <Button data={'C'} func={() => clear()} />
                    <Button data={'0'} />
                    <Button data={'0'} />
                </div>

                <div className="l_content_bottom">
                    {btnData.map( (value, key) => {
                        return <Button data={value} internalData={value} func={() => addNum(value)} key={key} />
                    })}
                </div>

            </div>

            <div className="r_content">
                {operateViewData.map( (value, index, i) => {
                    return <Button data={operateViewData[index]} internalData={operateInternalData[index]} func={() => operator(operateInternalData[index])} />
                })}
                <Button data={'='} internalData={'='} func={() => equal()} />
            </div>

        </div>
        );
  };

  const mapStateToProps = (state: AppState): stateByProps => {
    return {
        startState: state.Reducer.start,
        lifeCycleState: state.Reducer.lifeCycle,
        operatorState: state.Reducer.operatorState,
        floatState: state.Reducer.float,
        formulaState: state.Reducer.formula,
        dis_numState: state.Reducer.dis_num,
    }
};

const mapDispatchToProps = (dispatch: Dispatch): dispatchByProps => {
    return {
        start: (arg) => { arg ? dispatch( {type: 'TRUE_START'} ) : dispatch( {type: 'FALSE_START'} ) },
        lifeCycle: (arg) => { arg ? dispatch( {type: 'TRUE_LIFECYCLE'}) : dispatch( {type: 'FALSE_LIFECYCLE'} ) },
        operator: (arg) => { arg ? dispatch( {type: 'TRUE_OPERATOR'}) : dispatch( {type: 'FALSE_OPERATOR'} ) },
        float: (arg) => { arg ? dispatch( {type: 'TRUE_FLOAT'}) : dispatch( {type: 'FALSE_FLOAT'} ) },
        formula: (arg) => { dispatch( {type: 'FORMULA_CHANGE', formula: arg} ) },
        dis_num: (arg) => { dispatch( {type: 'DISPLAY_NUM_CHANGE', dis_num: arg} ) },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Controller);