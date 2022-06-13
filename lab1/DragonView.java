import javax.swing.*;
import java.awt.*;

public class DragonView extends JPanel {
    public void paintComponent(Graphics graphics)
    {
        super.paintComponents(graphics);
        graphics.setColor(Color.RED);
        drawDragon(180, 200, 400, 450, 24, graphics);
        repaint();
    }

    private void drawDragon(int x1, int y1, int x2, int y2, int n, Graphics graphics)
    {
        int xx, yy;
        if(n > 0)

        {
            xx = (x1 + x2) / 2 + (y2 - y1) / 2;
            yy = (y1 + y2) / 2 - (x2 - x1) / 2 ;
            drawDragon(x2, y2, xx, yy, n - 1, graphics);
            drawDragon(x1, y1, xx, yy, n - 1, graphics);
        }
        if(n == 0)
            graphics.drawLine(x1, y1, x2, y2);
    }

}
