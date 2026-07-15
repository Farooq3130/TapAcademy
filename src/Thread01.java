class Add extends Thread{
	@Override
	public void run() {
		for(int i='a';i<'f';i++) {
			System.out.println((char)i);
			try {
				Thread.sleep(3000);
			}
			catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
}
class Num extends Thread{
	@Override
	public void run() {
		for(int i=0;i<6;i++) {
			System.out.println(i);
			try {
				Thread.sleep(3000);
			}
			catch(Exception e) {
				e.printStackTrace();
			}
		}
	}
}
public class Thread01 {

	public static void main(String[] args) {
		Add a = new Add();
		Num n = new Num();
//		a.start();
//		n.start();
		a.run();
		n.run();

	}

}
