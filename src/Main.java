import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
  public static void  randomplaces(int board[][]){
        int row=(int)(Math.random()*board.length);
        int col=(int)(Math.random()*board.length);
        board[row][col]=2;
        int row1=(int)(Math.random()*board.length);
        int col1=(int)(Math.random()*board.length);
        board[row1][col1]=2;
        displayboard(board);

    }
    public static List<Integer>  moveleftside(int[][] board,int row){
      List<Integer> list = new ArrayList<>();
      for(int i=0;i<board.length;i++){
          if(board[row][i]!=0) {
              list.add(board[row][i]);
          }
      }
     int i=0;
      List<Integer> res= new ArrayList<>();
     while(i<list.size()-1){
         int a= list.get(i);
         int b = list.get(i+1);
         if(a==b){
             res.add(a+b);
             i+=2;
         }
         else{
             res.add(a);
             i+=1;
         }
     }
     if(i<list.size()){
         res.add(list.get(list.size()-1));
     }
     return res;
    }
  public   static void horizontal(){
        System.out.println("------------------");
    }
    public static void displayboard(int board[][]){
        for(int row=0;row<4;row++){ //row
            horizontal();
            for(int col=0;col<4;col++){
                System.out.print("| "+board[row][col]+" ");
            }
            System.out.print(" |");
            System.out.println();
        }
        horizontal();
    }
    public static void main(String[] args) {
           int board[][] = new int[4][4];
           Scanner  in = new Scanner(System.in);
           char choice = in.next().charAt(0);
           if(choice=='w'){
               //move up
           }
           else if(choice=='s'){
                // move down
           }
           else if(choice=='d'){
             // move right
               for(int i=board.length-1;i>=0;i--){
                   List<Integer> l2=moveleftside(board,i);
                   for(int j=0;j<l2.size();j++){
                       board[i][j]=l2.get(j);
                   }
               }
           }
           else{
               //move left
               for(int row=0;row<4;row++){
                   List<Integer> l1=moveleftside(board,row);
                   for(int i=0;i<l1.size();i++){
                       board[row][i]=l1.get(i);
                   }
                   for(int i=l1.size();i<4;i++){
                       board[row][i]=0;
                   }
               }
           }
           displayboard(board);
           randomplaces(board);
    }
}