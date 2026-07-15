import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Sundays {
	public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String start = sc.next();
        int n = sc.nextInt();

        Map<String, Integer> map = new HashMap<>();
        map.put("mon", 0);
        map.put("tue", 1);
        map.put("wed", 2);
        map.put("thu", 3);
        map.put("fri", 4);
        map.put("sat", 5);
        map.put("sun", 6);

        int startIndex = map.get(start);

        int daysToSunday = (6 - startIndex + 7) % 7;

        if (n <= daysToSunday) {
            System.out.println(0);
        } else {
            int remaining = n - daysToSunday - 1;
            int result = 1 + (remaining / 7);
            System.out.println(result);
        }
    }

}
