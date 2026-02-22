require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Branch, Appointment, Payment, InventoryItem, Transection } = require('./models');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function toThaiYearRange() {
  return { start: 2025, end: 2026 };
}

async function seed() {
  const reset = process.env.SEED_RESET === 'true';

  try {
    await sequelize.authenticate();
    await sequelize.sync(reset ? { force: true } : undefined);

    const passwordHash = await bcrypt.hash('password123', 10);

    const [branchMain] = await Branch.findOrCreate({
      where: { name: 'สาขาสยาม' },
      defaults: { address: 'สยามสแควร์ กรุงเทพฯ', phone: '021111111', isActive: true }
    });
    const [branchLatPhrao] = await Branch.findOrCreate({
      where: { name: 'สาขาลาดพร้าว' },
      defaults: { address: 'ลาดพร้าว กรุงเทพฯ', phone: '022222222', isActive: true }
    });
    const [branchRatchada] = await Branch.findOrCreate({
      where: { name: 'สาขารัชดา' },
      defaults: { address: 'รัชดา กรุงเทพฯ', phone: '023333333', isActive: true }
    });
    const branches = [branchMain, branchLatPhrao, branchRatchada];

    const admin = await User.findOrCreate({
      where: { email: 'admin@jelbarber.com' },
      defaults: { passwordHash, name: 'แอดมินระบบ', phone: '0890000001', role: 'admin', isActive: true }
    });

    const employeeNames = ['ช่างบาส', 'ช่างเฟิร์ส', 'ช่างพีท', 'ช่างกอล์ฟ', 'ช่างดรีม', 'ช่างป่าน'];
    const employees = [];
    for (let i = 0; i < employeeNames.length; i += 1) {
      const email = `barber${i + 1}@jelbarber.com`;
      const [row] = await User.findOrCreate({
        where: { email },
        defaults: {
          passwordHash,
          name: employeeNames[i],
          phone: `08900000${String(i + 2).padStart(2, '0')}`,
          role: 'employee',
          isActive: true
        }
      });
      employees.push(row);
    }

    const usedUserNames = new Set();
    const existingNameRows = await User.findAll({ attributes: ['name'], raw: true });
    for (const row of existingNameRows) {
      if (row.name) {
        usedUserNames.add(row.name);
      }
    }

    const firstNames = ['ธนา', 'พิมพ์', 'เอก', 'นที', 'ก้อง', 'พลอย', 'มิน', 'ภพ', 'ดาว', 'ฟ้า', 'บีม', 'เตย'];
    const lastNames = ['ศรีสุข', 'ใจดี', 'วัฒนา', 'บุญส่ง', 'สกุลไทย', 'วงศ์ดี', 'จันทรา', 'ทองดี'];
    const members = [];
    const memberCount = 400;
    const baseNameCounts = new Map();
    for (let i = 0; i < memberCount; i += 1) {
      const baseName = `คุณ${randomItem(firstNames)} ${randomItem(lastNames)}`;
      let name = baseName;
      if (usedUserNames.has(name)) {
        let index = baseNameCounts.get(baseName) || 0;
        do {
          index += 1;
          name = `${baseName} ${index}`;
        } while (usedUserNames.has(name));
        baseNameCounts.set(baseName, index);
      }
      usedUserNames.add(name);
      const email = `member${String(i + 1).padStart(4, '0')}@jelbarber.com`;
      const phone = `08${randomInt(10000000, 99999999)}`;
      const [row] = await User.findOrCreate({
        where: { email },
        defaults: {
          passwordHash,
          name,
          phone,
          role: 'member',
          isActive: true
        }
      });
      members.push(row);
    }

    const inventorySeeds = [
      { sku: 'SKU-HAIRWAX-001', name: 'แว็กซ์จัดแต่งทรงผม', unit: 'กระปุก', cost: 120.0 },
      { sku: 'SKU-SHAMPOO-002', name: 'แชมพูสมุนไพร', unit: 'ขวด', cost: 85.0 },
      { sku: 'SKU-CAPE-003', name: 'ผ้าคลุมตัดผม', unit: 'ผืน', cost: 150.0 },
      { sku: 'SKU-COMB-004', name: 'หวีตัดผม', unit: 'อัน', cost: 35.0 },
      { sku: 'SKU-CLIPPER-005', name: 'ปัตตาเลี่ยน', unit: 'เครื่อง', cost: 1850.0 },
      { sku: 'SKU-SCISSOR-006', name: 'กรรไกรตัดผม', unit: 'อัน', cost: 650.0 }
    ];

    for (const branch of branches) {
      for (const item of inventorySeeds) {
        await InventoryItem.findOrCreate({
          where: { sku: `${item.sku}-${branch.id}` },
          defaults: {
            branchId: branch.id,
            sku: `${item.sku}-${branch.id}`,
            name: item.name,
            quantity: randomInt(5, 40),
            unit: item.unit,
            cost: item.cost
          }
        });
      }
    }

    const serviceNotes = ['ตัดผมชาย', 'สระ+ไดร์', 'โกนหนวด', 'ตัด+สระ', 'ทำสีผม'];
    const paymentMethods = ['cash', 'card', 'transfer', 'qr'];
    const incomeCategories = ['ค่าบริการตัดผม', 'ค่าบริการสระผม', 'จำหน่ายสินค้า'];
    const expenseCategories = ['ค่าวัสดุสิ้นเปลือง', 'ค่าเช่า', 'ค่าอุปกรณ์', 'ค่าน้ำไฟ'];
    const { start, end } = toThaiYearRange();

    let appointmentTotal = 0;
    let paymentTotal = 0;
    let transectionTotal = 0;

    for (let year = start; year <= end; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        for (let day = 1; day <= daysInMonth; day += 1) {
          const customersToday = randomInt(5, 15);
          const appointments = [];
          for (let i = 0; i < customersToday; i += 1) {
            const hour = 10 + (i % 8);
            const minute = i % 2 === 0 ? 0 : 30;
            const startAt = new Date(Date.UTC(year, month, day, hour, minute, 0));
            const endAt = new Date(Date.UTC(year, month, day, hour, minute + 30, 0));
            const branch = randomItem(branches);
            const member = randomItem(members);
            const employee = randomItem(employees);

            appointments.push({
              branchId: branch.id,
              memberId: member.id,
              employeeId: employee.id,
              startAt,
              endAt,
              status: 'completed',
              notes: randomItem(serviceNotes)
            });
          }

          const created = await Appointment.bulkCreate(appointments, { returning: true });
          appointmentTotal += created.length;

          const payments = [];
          const transections = [];

          for (const appt of created) {
            const amount = randomInt(200, 900);
            const method = randomItem(paymentMethods);
            const paidAt = new Date(appt.endAt.getTime() + 5 * 60 * 1000);

            payments.push({
              appointmentId: appt.id,
              amount,
              currency: 'THB',
              method,
              status: 'paid',
              paidAt
            });

            transections.push({
              type: 'income',
              amount,
              category: randomItem(incomeCategories),
              note: `${randomItem(serviceNotes)} (${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')})`,
              occurredAt: paidAt,
              method
            });
          }

          const dailyExpense = randomInt(300, 1200);
          transections.push({
            type: 'expense',
            amount: dailyExpense,
            category: randomItem(expenseCategories),
            note: `ค่าใช้จ่ายประจำวัน (${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')})`,
            occurredAt: new Date(Date.UTC(year, month, day, 18, 0, 0)),
            method: randomItem(['cash', 'transfer'])
          });

          await Payment.bulkCreate(payments);
          await Transection.bulkCreate(transections);

          paymentTotal += payments.length;
          transectionTotal += transections.length;
        }
      }
    }

    console.log('Seed completed');
    console.log(`Branches: ${branches.length}`);
    console.log(`Users: admin=${admin[0].id}, employees=${employees.length}, members=${members.length}`);
    console.log(`Appointments: ${appointmentTotal}`);
    console.log(`Payments: ${paymentTotal}`);
    console.log(`Transections: ${transectionTotal}`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
