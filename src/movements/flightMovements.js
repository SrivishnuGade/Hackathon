import { gsap } from 'gsap';

export function glideRunway(plane) {
    let currentX = plane.position.x;
    gsap.to(plane.position, {
        duration: 15,
        x: currentX +450, // 1125 + 450
        y: 0.2,
        z: 0
    });
}

export function combinedLanding(plane) {
    let currentX = plane.position.x;
    const timeline = gsap.timeline();

    // Ideal landing animation
    timeline.to(plane.position, {
        duration: 15,
        ease: "none",
        x: currentX + 1125,
        y: 0.2,
        z: 0
    });

    // Landing animation after ideal landing
    timeline.to(plane.position, {
        duration: 20,
        x: currentX + 1125+450, // 1125 + 450
        y: 0.2,
        z: 0
    });

    return timeline;
}
export function movePlaneDown(plane, verticalSpeed, forwardSpeed) {
    let currentY = plane.position.y;
    let currentX = plane.position.x;

    // Ensure vertical speed is limited
    if (currentY - verticalSpeed < 0.2) {
        verticalSpeed = 0;
        currentY = 0.2;
    }

    gsap.to(plane.position, {
        duration: 0.25, 
        y: currentY - verticalSpeed,
        x: currentX + forwardSpeed,
        ease: "none" // Ensure no easing (constant speed)
    });
}


function animateUTurn1(plane, onComplete) {
    const radius = 50;
    const centerX=337.5;
    const centerZ=-50;
    const startAngle = 0;
    const endAngle = Math.PI;

    gsap.to(plane.position, {
        duration: 1.4*2,
        ease: "none",
        onUpdate: function () {
            const angle = startAngle + (endAngle - startAngle) * (this.progress());
            plane.position.x = centerX + radius * Math.sin(angle);
            plane.position.z = centerZ + radius * Math.cos(angle);
            plane.rotation.y = angle;
        },
        onComplete: onComplete
    });
}

function animateUTurn2(plane, onComplete) {
    const radius = 50;
    const centerX=-900;
    const centerZ=-50;
    const startAngle = Math.PI;
    const endAngle = 2*Math.PI;

    gsap.to(plane.position, {
        duration: 1.4*2,
        ease: "none",
        onUpdate: function () {
            const angle = startAngle + (endAngle - startAngle) * (this.progress());
            plane.position.x = centerX + radius * Math.sin(angle);
            plane.position.z = centerZ + radius * Math.cos(angle);
            plane.rotation.y = angle;
        },
        onComplete: onComplete
    });
}

export function goAround(plane){
    let yPosition=plane.position.y;

    const timeline = gsap.timeline();

    timeline.to(plane.position, { duration: 6*2,ease: "none", x: 337.5, y: Math.min(36,yPosition+20), z: 0})
            .add(() => {
                animateUTurn1(plane, () => {
                    // Step 3: Continue straight along the x-axis from (135, y, -60)
                    gsap.to(plane.position, {
                        duration: 9*2,
                        ease: "none",
                        x: -900,
                        y: 36,
                        z: -100,
                        onComplete: () => {
                            animateUTurn2(plane, () => {
                                gsap.to(plane.position, {
                                    duration: 6*2,
                                    ease: "none",
                                    x: -225,
                                    y: 0.2,
                                    z: 0,
                                    onComplete: () => {
                                        gsap.to(plane.position, {
                                            duration: 10*2,
                                            x: 225, // 1125 + 450
                                            y: 0.2,
                                            z: 0
                                        })
                                    }
                                });
                            });
                        }
                    });
                });
            });
}
