import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.util.*;


class mineSweeperCell {
    final String RED = "\u001b[2;31;40m";
    final String WHITE = "\u001b[0;37;40m";
    final String GREEN = "\u001b[0;32;40m";

    private final String UNFLIPPED = "- ";
    private final String FLAGGED = GREEN + "F " + WHITE;
    private final String BOMB = RED + "* " + WHITE;


    private boolean bomb;
    private boolean flagged;
    private int     neighbors;
    private boolean revealed;


    public void setTheBomb(boolean b) {	bomb = b; }
    public boolean isBomb(){ return bomb; }

    public void setFlagged(boolean f) {	flagged = f; }
    public boolean isFlagged(){ return flagged; }

    public void neighbors(int n) { neighbors = n; }
    public int getNeighbors(){	return neighbors; }

    public void setRevealed(boolean r) { revealed = r; }
    public boolean isRevealed(){ return revealed;  }

    public String toString(){
		if( flagged )
			return FLAGGED;

		if( !revealed )
			return UNFLIPPED;
			
		if( bomb )
			return BOMB;

		if(neighbors == 0){
			return "  ";
		}

		return neighbors + " ";
    }
}


class mineSweeperGrid {
    final int SIZE = 9;
    public mineSweeperCell[][] msg = new mineSweeperCell[SIZE][SIZE];

    public mineSweeperGrid() {
			for(int i = 0; i < SIZE; i++)
				for(int j = 0; j < SIZE; j++){
					msg[i][j] = new mineSweeperCell();
				}

			for(int i = 0; i <= 9; i = i + 0){
				int x = (int)(Math.random() * SIZE);
				int y = (int)(Math.random() * SIZE);
				if(msg[x][y].isBomb() == false){
					msg[x][y].setTheBomb(true);
					i++;
				}
			}

			for(int i=0; i<SIZE; i++){
				for(int j=0; j<SIZE; j++){
					int count = countNeighbors(i,j);
					msg[i][j].neighbors(count);
				}
			}
		}

	private int countNeighbors(int counterX, int counterY){
	    int bombCount = 0;
	    
	    for( int i = counterX - 1;  i <= counterX + 1; i++)
				for( int j = counterY - 1; j <= counterY + 1; j++)
					if((i == counterX && j == counterY) || i < 0 || i >= SIZE || j < 0 || j >= SIZE) ;
					else
						if(msg[i][j].isBomb())
							bombCount++;

	    return bombCount;
	}
    
    public void revealSaidSpace(int x, int y){
		final String WHITE = "\u001b[0;37;40m";
		final String RED = "\u001b[2;31;40m";
		final String GREEN = "\u001b[0;32;40m";

		if(x < 0 || x >= SIZE || y < 0 || y >= SIZE || msg[x][y].isRevealed())
			return;
		
		msg[x][y].setRevealed(true);	
		
		if(msg[x][y].isFlagged()){
			msg[x][y].setFlagged(false);
			msg[x][y].setRevealed(true);
		}

		if(msg[x][y].isBomb()){
			if(true){
				for(int i = 0; i <= 8; i++) {
					for(int j = 0; j <= 8; j++){
						if(msg[i][j].isBomb()){
							msg[i][j].setRevealed(true);

							if(msg[i][j].isFlagged()){
								msg[x][y].setFlagged(false);
								msg[x][y].setRevealed(true);
							}	
						}
					}	    
				}
			}

			System.out.println(toString());
			System.out.println( RED + "YOU ARE A BIG FAT LOSER!!!!" + GREEN);
			System.exit(0);
		}
		
		if(msg[x][y].getNeighbors() == 0){
			revealSaidSpace(x + 1, y);
			revealSaidSpace(x - 1, y);
			revealSaidSpace(x, y + 1);
			revealSaidSpace(x, y - 1);

			revealSaidSpace(x - 1, y - 1);
			revealSaidSpace(x - 1, y + 1);
			revealSaidSpace(x + 1, y + 1);
			revealSaidSpace(x + 1, y - 1);
		}
    }

    public void flagSaidSpace(int x, int y){

		if(x < 0 || x >= SIZE || y < 0 || y >= SIZE || msg[x][y].isRevealed() || msg[x][y].isFlagged())
			return;

		msg[x][y].setFlagged(true);
    }
    
    boolean checkToWin(){

		int counter = 0;

		for(int i = 0; i <= 8; i++){
			for(int j = 0; j <= 8; j++){
				
			if(msg[i][j].isBomb() == true && !msg[i][j].isRevealed() || msg[i][j].isFlagged() || msg[i][j].isRevealed())
				counter++;	
			}
		}

		if(counter == 81)
			return true;

		return false;
	}

    public String toString(){
		String toReturn = "";
		final String WHITE = "\u001b[0;37;40m";
		final String BLUE = "\u001b[2;34;40m";

		toReturn += (BLUE + "  0 1 2 3 4 5 6 7 8\n");

		for(int a = 0; a < 9; a++){
			toReturn += (BLUE + a + " " + WHITE);
			for(int b = 0; b < 9; b++){
				toReturn = toReturn + msg[a][b].toString();
			}

			toReturn = toReturn + "\n";
		}
	
		return toReturn;
    }
}

class driver{
    public static void main(String args[]){

		final String GREEN = "\u001b[0;32;40m";
		final String BLUE = "\u001b[2;34;40m";
		int frames = 1;

		mineSweeperCell msc = new mineSweeperCell();
		mineSweeperGrid msg = new mineSweeperGrid();

		System.out.println( msg.toString() );

		while(true){
			Scanner sc = new Scanner(System.in);

			System.out.println("If you want to flag a space type '1'\nIf you want to reveal a space type '2'");
			int ans = sc.nextInt();

			if(ans == 1){
				System.out.println("Enter the space you want to flag");
		
				int x = sc.nextInt();
				int y = sc.nextInt();

				msg.flagSaidSpace(x,y);
				frames++;
				System.out.println( msg.toString() );
			}
			
			if(ans == 2){
				System.out.println("Enter the space you want to reveal");
				
				int x = sc.nextInt();
				int y = sc.nextInt();
				
				msg.revealSaidSpace(x,y);
				frames++;
				System.out.println( msg.toString() );
				if(msg.checkToWin() == true){
					System.out.println( BLUE + "You won!? GRRRR!! Now play again so I can insult you when you lose");
					System.out.println( GREEN + "Ok, so it took you " + frames + " frames to finish the game");
					System.exit(0);
				}
			}
		}
    }
}