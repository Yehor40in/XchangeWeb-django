class Circle
{
    constructor(x, y, angle)
    {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}

const SPEED = 50;

let animatedBackground = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.screen.availWidth * window.devicePixelRatio;
    canvas.height = window.screen.availHeight * window.devicePixelRatio + 100;
    canvas.style.width = window.screen.availWidth + 'px';
    canvas.style.height = window.screen.availHeight + 100 + 'px';

    let circles = [];

    for (let i = 1; i < 20; i++)
    {
        for (let j = 1; j < 15; j++)
        {
            let angle = Math.random() * 360;
            let circle = new Circle(i * 100, j * 100, angle);
            circles.push(circle);
        }
    }

    for (let i = 0; i < circles.length; i++)
    {
        ctx.beginPath();
        ctx.arc(circles[i].x, circles[i].y, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.stroke();
        ctx.closePath();
    }

    setInterval( () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'rebeccapurple';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();

        for (let i = 0; i < circles.length; i++)
        {
            if (circles[i].x >= canvas.width || circles[i].y >= canvas.height)
            {
                circles[i].angle += 180;
            }
            else if (circles[i].y <= 0)
            {
                circles[i].angle *= -(1);
            }
            else if (circles[i].x <= 0)
            {
                circles[i].angle -= 180;
            }

            let newX, newY;
            newX = Math.cos(circles[i].angle) * 2 + circles[i].x;
            newY = Math.sin(circles[i].angle) * 2 + circles[i].y;
            circles[i].x = newX;
            circles[i].y = newY;
            ctx.beginPath();
            ctx.arc(newX, newY, 5, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.stroke();
            ctx.closePath();

            for (let j = 0; j < circles.length; j++)
            {
                const distance = Math.sqrt(Math.pow(circles[i].x - circles[j].x, 2) + Math.pow(circles[i].y - circles[j].y ,2));

                if (distance < 170)
                {
                    ctx.beginPath();
                    ctx.moveTo(circles[i].x, circles[i].y);
                    ctx.lineTo(circles[j].x, circles[j].y);
                    ctx.lineWidth = '1';
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }, SPEED);
}

animatedBackground();

    login_btn = document.getElementById('lopt_first');
    reg_btn = document.getElementById('lopt_second');
    login_form = document.getElementById('login_form');
    reg_form = document.getElementById('reg_form');

    reg_btn.addEventListener('click', (e) => {
        login_btn.style.backgroundColor = 'rebeccapurple';
        reg_btn.style.backgroundColor = 'rgb(84, 39, 129)';
        login_form.style.display = 'none';
        reg_form.style.display = 'block';
    })

    login_btn.addEventListener('click', (e) => {
        reg_btn.style.backgroundColor = 'rebeccapurple';
        login_btn.style.backgroundColor = 'rgb(84, 39, 129)';
        reg_form.style.display = 'none';
        login_form.style.display = 'block';
    })