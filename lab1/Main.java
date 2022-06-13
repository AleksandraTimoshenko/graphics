import javax.swing.*;

import static javax.swing.JFrame.EXIT_ON_CLOSE;
public class Main {
    public static void main(String[] args)
    {
        JFrame window = new JFrame("DragonFractal");
        window.setSize(700, 700);
        window.setContentPane(new DragonView());
        window.setResizable(false);
        window.setDefaultCloseOperation(EXIT_ON_CLOSE);
        window.setVisible(true);
    }
}
